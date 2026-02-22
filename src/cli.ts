import { Command } from "commander";
import { setVerbose } from "./utils.js";
import { registerAll } from "./commands/index.js";

declare const __VERSION__: string;

const program = new Command();

program
  .name("webcli")
  .description("Headless browser CLI for Claude Code")
  .version(__VERSION__)
  .option("--verbose", "enable verbose logging");

registerAll(program);

program.hook("preAction", (thisCommand) => {
  const opts = thisCommand.optsWithGlobals();
  if (opts.verbose) setVerbose(true);
});

program.parse();
