import type { Command } from "commander";
import { send } from "../client.js";
import { globalOpts, output, type Opts } from "./shared.js";

export function register(program: Command): void {
  const cmd = program.command("drag <from> <to>").description("Drag and drop between two selectors");
  globalOpts(cmd);
  cmd.action(async (from: string, to: string, opts: Opts) => {
    const res = await send({ action: "drag", tab: opts.tab, args: { from, to }, timeout: parseInt(opts.timeout) });
    output(res, opts, (d) => `Dragged: ${d.from} -> ${d.to}`);
  });
}
