import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        /* The review harness, unchanged. */
        main: "index.html",
        /*
          The responsive preview. Separate entry because it must render a screen
          against the real viewport with nothing beside it; see src/preview.tsx
          for why neither existing app can do that.
        */
        preview: "preview.html",
      },
    },
  },
});
