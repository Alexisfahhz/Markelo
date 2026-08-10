import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/*
  Single-file build of the 5180 prototype flow, for publishing as an artifact.

  Separate from vite.config.ts because the artifact must be one self-contained
  HTML file: one IIFE bundle, no module graph, no external requests (the artifact
  CSP blocks CDNs, including the Google Fonts the normal index.html links). The
  screens still come live from ../webapp-scaffold at build time.

  charset "ascii" escapes every non-ASCII byte, so the inlined bundle renders the
  same middots, curly quotes and accents under any charset a host happens to send.
  Output goes to dist-artifact/ so it cannot collide with the normal build.
*/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  esbuild: { charset: "ascii" },
  build: {
    outDir: "dist-artifact",
    emptyOutDir: true,
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000,
    rollupOptions: {
      input: "artifact.html",
      output: {
        format: "iife",
        inlineDynamicImports: true,
        entryFileNames: "artifact.js",
        assetFileNames: "artifact.[ext]",
      },
    },
  },
});
