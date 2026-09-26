import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Component lab · Kino",
  description:
    "Explore real React scroll scenes, local parallax, comparison sliders, media fallbacks, and a portable story renderer.",
  alternates: { canonical: "https://www.react-kino.dev/playground" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
