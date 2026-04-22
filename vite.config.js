import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/final-project-shinobi/",
  plugins: [react()],
  server: { port: 5173, open: true },
  preview: { port: 5173 },
});