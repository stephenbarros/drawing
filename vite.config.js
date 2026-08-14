import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Deployed to GitHub Pages at https://stephenbarros.github.io/drawing/,
// so assets are served from the /drawing/ sub-path rather than the root.
export default defineConfig({
  plugins: [react()],
  base: "/drawing/",
});
