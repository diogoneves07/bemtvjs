import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      name: "Bemtevi",
      fileName: (format) => `bemtevi.${format}.js`,
    },
  },
});
