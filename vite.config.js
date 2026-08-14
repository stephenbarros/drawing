import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Deployed to GitHub Pages at https://pencilpractice.com/, a custom apex
// domain, so the site is served from the root rather than a repo sub-path.
export default defineConfig({
  plugins: [react()],
  base: "/",
});
