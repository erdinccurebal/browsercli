import { defineConfig } from "tsup";
import pkg from "./package.json" with { type: "json" };

export default defineConfig({
  entry: {
    cli: "src/cli.ts",
    daemon: "src/daemon.ts",
  },
  format: "esm",
  target: "node22",
  outDir: "dist",
  clean: true,
  splitting: true,
  banner: {
    js: "#!/usr/bin/env node",
  },
  define: {
    __VERSION__: JSON.stringify(pkg.version),
  },
});
