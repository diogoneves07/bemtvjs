import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    sourcemap: true,

    lib: {
      entry: [path.resolve(__dirname, "src/main.ts")],
      name: "Bemtv",
      fileName: "bemtv",
    },
  },
});
