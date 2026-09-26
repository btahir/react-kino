import "./global.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.react-kino.dev"),
  title: {
    default: "Kino — React scroll storytelling & visual editor",
    template: "%s | react-kino",
  },
  description:
    "Cinematic scroll-driven storytelling for React. Responsive stories, visual timing, and portable source.",
  alternates: { canonical: "https://www.react-kino.dev" },
  openGraph: {
    title: "react-kino",
    description:
      "Cinematic scroll-driven storytelling for React. Responsive stories, visual timing, and portable source.",
    images: ["/opengraph-image"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "react-kino",
    description:
      "Cinematic scroll-driven storytelling for React. Responsive stories, visual timing, and portable source.",
    images: ["/opengraph-image"],
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
