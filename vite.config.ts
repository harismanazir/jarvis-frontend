import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist", // Output directory for Vercel
    emptyOutDir: true
  },
  server: {
    port: 5173 // Local dev port
  },
  preview: {
    port: 4173
  }
});
