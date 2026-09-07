import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "lcov"],
      include: ["src/lib/**/*.{ts,tsx}"],
      exclude: [
        "src/lib/prisma.ts",
        "src/lib/auth.ts",
        "src/lib/email.ts",
        "**/*.d.ts",
      ],
      thresholds: {
        lines: 35,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
