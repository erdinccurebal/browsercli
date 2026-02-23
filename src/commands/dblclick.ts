import type { Command } from "commander";
import { send } from "../client.js";
import { globalOpts, output, type Opts } from "./shared.js";

export function register(program: Command): void {
  const cmd = program.command("dblclick <text>").description("Double-click element by visible text");
  globalOpts(cmd);
  cmd.action(async (text: string, opts: Opts) => {
    const res = await send({ action: "dblclick", tab: opts.tab, args: { text }, timeout: parseInt(opts.timeout) });
    output(res, opts, (d) => `Double-clicked "${d.clicked}" -> ${d.url}`);
  });
}
