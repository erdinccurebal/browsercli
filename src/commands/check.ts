import type { Command } from "commander";
import { send } from "../client.js";
import { globalOpts, output, type Opts } from "./shared.js";

export function register(program: Command): void {
  const cmd = program.command("check <selector>").description("Check a checkbox");
  globalOpts(cmd);
  cmd.action(async (selector: string, opts: Opts) => {
    const res = await send({ action: "check", tab: opts.tab, args: { selector }, timeout: parseInt(opts.timeout) });
    output(res, opts, (d) => `Checked: ${d.selector}`);
  });
}
