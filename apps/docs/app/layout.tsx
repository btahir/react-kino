import "./global.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://react-kino.dev"),
  title: {
    default: "react-kino",
    template: "%s | react-kino",
  },
  description:
    "Cinematic scroll-driven storytelling for React. Core engine under 1 KB gzipped.",
  openGraph: {
    title: "react-kino",
    description:
      "Cinematic scroll-driven storytelling for React. Core engine under 1 KB gzipped.",
    images: ["/og.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "react-kino",
    description:
      "Cinematic scroll-driven storytelling for React. Core engine under 1 KB gzipped.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
