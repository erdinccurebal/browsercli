import path from "node:path";
import type { Command } from "commander";
import { send } from "../client.js";
import { globalOpts, output, type Opts } from "./shared.js";

export function register(program: Command): void {
  const cmd = program.command("upload <selector> <file>").description("Upload a file to an input element");
  globalOpts(cmd);
  cmd.action(async (selector: string, file: string, opts: Opts) => {
    const filePath = path.resolve(file);
    const res = await send({ action: "upload", tab: opts.tab, args: { selector, filePath }, timeout: parseInt(opts.timeout) });
    output(res, opts, (d) => `Uploaded: ${d.file} -> ${d.selector}`);
  });
}
