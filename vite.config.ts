import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/Tfarhida/" : "/",
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        app: resolve(__dirname, "src/main.tsx"),
      },
      output: {
        entryFileNames: (chunk) => (chunk.name === "app" ? "assets/app.js" : "assets/[name].js"),
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
}));
