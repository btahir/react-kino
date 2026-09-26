import type { ReactNode } from "react";
export const metadata = {
  robots: { index: false, follow: false },
  title: "Kino runtime verification",
};
export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
