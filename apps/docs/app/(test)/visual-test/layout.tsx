import type { ReactNode } from "react";

export const metadata = { robots: { index: false, follow: false } };

export default function VisualTestLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
