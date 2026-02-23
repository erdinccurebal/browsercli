import path from "node:path";
import type { Command } from "commander";
import { send } from "../client.js";
import { globalOpts, output, type Opts } from "./shared.js";

export function register(program: Command): void {
  const cmd = program.command("state <action> [file]").description("Save/load browser state (cookies + storage)");
  globalOpts(cmd);
  cmd.action(async (action: string, file: string | undefined, opts: Opts) => {
    if (action === "save") {
      const outputPath = file ? path.resolve(file) : undefined;
      const res = await send({ action: "state-save", tab: opts.tab, args: { output: outputPath }, timeout: parseInt(opts.timeout) });
      output(res, opts, (d) => `State saved: ${d.path}`);
    } else if (action === "load") {
      if (!file) {
        process.stderr.write("Error: file path required for state load\n");
        process.exit(1);
      }
      const inputPath = path.resolve(file);
      const res = await send({ action: "state-load", tab: opts.tab, args: { input: inputPath }, timeout: parseInt(opts.timeout) });
      output(res, opts, (d) => `State loaded from ${d.url}`);
    } else {
      process.stderr.write(`Error: unknown action "${action}". Use "save" or "load".\n`);
      process.exit(1);
    }
  });
}
