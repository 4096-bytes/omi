import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const srcDir = fileURLToPath(new URL("./src", import.meta.url));
const serverOnlyStub = fileURLToPath(
  new URL("./tests/server-only.ts", import.meta.url)
);

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "~": srcDir,
      "server-only": serverOnlyStub,
    },
  },
});

