import type { Command } from "commander";
import { send } from "../client.js";
import { globalOpts, output, type Opts } from "./shared.js";

export function register(program: Command): void {
  const cmd = program.command("scroll <direction> [amount]").description("Scroll the page (up/down/left/right)");
  globalOpts(cmd);
  cmd.action(async (direction: string, amount: string | undefined, opts: Opts) => {
    const args: Record<string, unknown> = { direction };
    if (amount) args.amount = parseInt(amount, 10);
    const res = await send({ action: "scroll", tab: opts.tab, args, timeout: parseInt(opts.timeout) });
    output(res, opts, (d) => `Scrolled ${d.direction} ${d.amount}px`);
  });
}
