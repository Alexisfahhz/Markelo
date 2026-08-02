import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5180,
    strictPort: true,
    fs: {
      // Screens are imported live from ../webapp-scaffold (the source of
      // truth). Vite blocks files outside the project root by default.
      allow: [".."],
    },
  },
});
