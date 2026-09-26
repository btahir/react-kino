import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Case study template",
  alternates: { canonical: "https://www.react-kino.dev/templates/case-study" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
