import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: "react-kino",
      }}
      links={[
        { text: "Home", url: "/" },
        { text: "Storyboard", url: "/studio" },
        {
          text: "Support this project",
          url: "https://react-tourlight.vercel.app/support",
          external: true,
        },
        {
          text: "GitHub",
          url: "https://github.com/btahir/react-kino",
          external: true,
        },
      ]}
      githubUrl="https://github.com/btahir/react-kino"
    >
      {children}
    </DocsLayout>
  );
}
