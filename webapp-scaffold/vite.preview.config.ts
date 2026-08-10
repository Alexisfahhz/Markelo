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
  /*
    Escape every non-ASCII character to \uXXXX in the JS output.

    This file gets inlined into a single HTML page and served by hosts we do not
    control. A host that sends no charset makes the browser fall back to
    windows-1252, and every middot, curly quote and accented character in the
    screens renders as mojibake: "2025/2026 A. First Semester". Escaping makes
    the bundle pure ASCII, so it reads identically under any charset instead of
    depending on a header we cannot guarantee.
  */
  esbuild: { charset: "ascii" },
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
