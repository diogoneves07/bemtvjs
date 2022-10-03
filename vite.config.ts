import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      name: "bentive",
      fileName: (format) => `bentive.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["bentive"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          Html: "bentive",
        },
      },
    },
  },
});
