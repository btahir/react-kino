import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Full-page templates",
  alternates: { canonical: "https://www.react-kino.dev/templates" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
