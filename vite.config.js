import { defineConfig } from "vite";

export default defineConfig({
  // Relative asset paths, so the built site works from any folder
  // (for example a GitHub Pages project URL like /personalPortfolio/).
  base: "./",
  build: {
    outDir: "dist",
    // Keep the logos and icons as separate files instead of inlining them.
    assetsInlineLimit: 0,
  },
});
