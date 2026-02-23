import type { Command } from "commander";
import { send } from "../client.js";
import { globalOpts, output, type Opts } from "./shared.js";

export function register(program: Command): void {
  const cmd = program.command("uncheck <selector>").description("Uncheck a checkbox");
  globalOpts(cmd);
  cmd.action(async (selector: string, opts: Opts) => {
    const res = await send({ action: "uncheck", tab: opts.tab, args: { selector }, timeout: parseInt(opts.timeout) });
    output(res, opts, (d) => `Unchecked: ${d.selector}`);
  });
}
