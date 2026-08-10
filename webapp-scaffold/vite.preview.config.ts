import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/*
  Single-file build of the responsive preview, for sharing.

  Separate from vite.config.ts because it needs a bundle with no module graph:
  one IIFE, no code splitting, no import linkage. Concatenating the normal ES
  module chunks by hand does NOT work; the entry chunk imports named bindings
  from the shared chunk, and splicing the files together leaves those imports
  dangling, so React never mounts and the page renders blank with no error.

  Output goes to dist-preview/ so it cannot collide with the normal build.
*/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist-preview",
    emptyOutDir: true,
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000, // inline every asset as a data URI
    rollupOptions: {
      input: "preview.html",
      output: {
        format: "iife",
        inlineDynamicImports: true,
        entryFileNames: "preview.js",
        assetFileNames: "preview.[ext]",
      },
    },
  },
});
