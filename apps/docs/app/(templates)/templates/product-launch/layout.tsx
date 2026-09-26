import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Product launch template",
  alternates: {
    canonical: "https://www.react-kino.dev/templates/product-launch",
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
