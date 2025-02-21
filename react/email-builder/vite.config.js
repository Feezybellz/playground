import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { randomBytes } from "crypto";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      crypto: "crypto-browserify",
    },
  },
  define: {
    "global.crypto": {
      getRandomValues: (arr) => {
        const buf = randomBytes(arr.length);
        arr.set(buf);
        return arr;
      },
    },
  },
});
