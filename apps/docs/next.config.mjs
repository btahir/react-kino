import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  distDir: process.env.KINO_BUILD_DIR || ".next",
};

export default withMDX(config);
