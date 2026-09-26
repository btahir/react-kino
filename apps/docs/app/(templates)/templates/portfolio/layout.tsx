import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Portfolio template",
  alternates: { canonical: "https://www.react-kino.dev/templates/portfolio" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
