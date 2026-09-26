import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("landing is readable and navigates to the real editor", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Give your story/ }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Make a story" }).click();
  await expect(
    page.getByRole("heading", { name: "Storyboard." }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("editor content, undo/redo, export, validated import and reload draft", async ({
  page,
  context,
  browserName,
}) => {
  await page.goto("/studio");
  const content = page.getByRole("textbox", { name: "Layer content" });
  await content.fill("A story we can own.");
  await content.press("Tab");
  await expect(
    page.getByRole("heading", { name: "A story we can own." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Less noise. More focus." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Redo", exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("kino-storyboard-v1")))
    .toContain("A story we can own.");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download JSON" }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe("story.kino.json");
  const stream = await file.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  const exported = JSON.parse(Buffer.concat(chunks).toString());
  expect(exported.scenes[0].layers[0].content).toBe("A story we can own.");
  if (browserName === "chromium") {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.getByRole("button", { name: "Copy JSON", exact: true }).click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(JSON.parse(copied)).toEqual(exported);
  }
  await page.reload();
  await page.getByRole("button", { name: "Restore draft" }).click();
  await expect(content).toHaveValue("A story we can own.");
  await page.locator("input[type=file]").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":99}'),
  });
  await expect(page.locator(".ks-error[role=alert]")).toContainText(
    "version 1",
  );
  await expect(content).toHaveValue("A story we can own.");
  await page.getByRole("button", { name: "Dismiss error" }).click();
  await page.getByRole("button", { name: "Clear saved draft" }).click();
  expect(
    await page.evaluate(() => localStorage.getItem("kino-storyboard-v1")),
  ).toBeNull();
});
test("timeline is directly draggable and keyboard editable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/studio");
  const handle = page.getByRole("slider", {
    name: "headline end",
    exact: true,
  });
  await handle.scrollIntoViewIfNeeded();
  const box = await handle.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.mouse.down();
  await page.mouse.move(box!.x + 100, box!.y + box!.height / 2, { steps: 8 });
  await page.mouse.up();
  const value = Number(
    await page
      .getByRole("spinbutton", { name: "Track end", exact: true })
      .inputValue(),
  );
  expect(value).toBeGreaterThan(0.4);
  await handle.focus();
  await handle.press("ArrowLeft");
  await expect(
    page.getByRole("spinbutton", { name: "Track end", exact: true }),
  ).toHaveValue(String(Math.round((value - 0.01) * 100) / 100));
});
test("mobile authoring and reading layout have no horizontal document overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/studio");
  await expect(
    page.getByRole("heading", { name: "Storyboard." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Mobile · 390" }).click();
  await expect(
    page.getByText("Natural reading layout · all content visible"),
  ).toBeVisible();
  const headline = page.locator('[data-kino-layer="headline"]').first();
  await expect(headline).toHaveCSS("opacity", "1");
  await page.goto("/recipes/editorial");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  await expect(
    page.getByRole("heading", { name: "What do we carry forward?" }),
  ).toBeVisible();
});
test("nested root updates and tall content reveals late children", async ({
  page,
}) => {
  await page.goto("/runtime-check");
  await page.getByRole("button", { name: "Expand content" }).click();
  await expect(page.getByTestId("late-reveal").locator("..")).toHaveCSS(
    "opacity",
    "1",
  );
  await page.getByRole("button", { name: "Resize root" }).click();
  await expect(page.getByTestId("scroll-root")).toHaveCSS("height", "300px");
  await expect(page.getByTestId("late-reveal").locator("..")).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(
    page.getByTestId("tall-story").locator('[data-kino-layer="headline"]'),
  ).toHaveCSS("opacity", "1");
  const root = page.getByTestId("scroll-root");
  await root.evaluate((el) => {
    el.scrollTop = 1200;
  });
  await expect
    .poll(() =>
      page
        .getByTestId("local-parallax")
        .locator("..")
        .evaluate((el) => getComputedStyle(el).transform),
    )
    .not.toBe("matrix(1, 0, 0, 1, 0, 0)");
  await expect(
    page.getByText("Unavailable fixture is unavailable."),
  ).toBeVisible();
});
test("reduced motion preserves complete scenes and horizontal panels", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/runtime-check");
  await expect(page.getByTestId("late-reveal").locator("..")).toHaveCSS(
    "opacity",
    "1",
  );
  const third = page.getByText("Third horizontal panel");
  await expect(third).toBeVisible();
  expect(
    await third.evaluate((el) => el.getBoundingClientRect().left),
  ).toBeGreaterThanOrEqual(0);
  await expect(page.locator("video")).not.toHaveAttribute("src");
  await expect(page.getByText("Readable media caption")).toBeVisible();
});
test("all recipes and discovery endpoints resolve", async ({ request }) => {
  for (const route of [
    "/recipes/launch",
    "/recipes/editorial",
    "/recipes/case-study",
    "/recipes/comparison",
    "/recipes/gallery",
    "/recipes/portfolio",
    "/registry/components/scene.json",
    "/schema/story-v1.json",
    "/llms.txt",
    "/llms-full.txt",
    "/sitemap.xml",
    "/robots.txt",
  ]) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
  }
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("https://www.react-kino.dev/studio");
  expect(sitemap).not.toContain("runtime-check");
});
test("editor has accessible names and no serious automated accessibility findings", async ({
  page,
}) => {
  await page.goto("/studio");
  const results = await new AxeBuilder({ page })
    .include(".kino-studio")
    .analyze();
  expect(
    results.violations
      .filter((v) => v.impact === "critical" || v.impact === "serious")
      .map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
  ).toEqual([]);
});

test("component lab seeks real media and keeps error content readable", async ({
  page,
}) => {
  await page.goto("/playground");
  const video = page.getByLabel(
    "A camera moving across an original schematic workspace",
  );
  await expect
    .poll(() => video.evaluate((el: HTMLVideoElement) => el.duration))
    .toBe(4);
  await video.evaluate((el) => {
    const scene = el.parentElement!.parentElement!;
    window.scrollTo(
      0,
      scene.getBoundingClientRect().top +
        window.scrollY +
        window.innerHeight * 0.6,
    );
  });
  await expect
    .poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime))
    .toBeGreaterThan(0.5);
  await expect(
    page.getByText(
      "This sample has no video file. The story continues with its caption.",
    ),
  ).toBeVisible();
});
