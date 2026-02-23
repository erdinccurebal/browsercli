import type { Command } from "commander";

import { register as go } from "./go.js";
import { register as back } from "./back.js";
import { register as forward } from "./forward.js";
import { register as reload } from "./reload.js";
import { register as source } from "./source.js";
import { register as links } from "./links.js";
import { register as forms } from "./forms.js";
import { register as evalCmd } from "./eval.js";
import { register as html } from "./html.js";
import { register as attr } from "./attr.js";
import { register as click } from "./click.js";
import { register as clicksel } from "./clicksel.js";
import { register as focus } from "./focus.js";
import { register as type_ } from "./type.js";
import { register as fill } from "./fill.js";
import { register as select } from "./select.js";
import { register as screenshot } from "./screenshot.js";
import { register as wait } from "./wait.js";
import { register as waitfor } from "./waitfor.js";
import { register as press } from "./press.js";
import { register as sleep } from "./sleep.js";
import { register as cookie } from "./cookie.js";
import { register as viewport } from "./viewport.js";
import { register as useragent } from "./useragent.js";
import { register as network } from "./network.js";
import { register as quit } from "./quit.js";
import { register as tabs } from "./tabs.js";
import { register as status } from "./status.js";
import { register as stop } from "./stop.js";
// Batch 1: Interaction
import { register as dblclick } from "./dblclick.js";
import { register as hover } from "./hover.js";
import { register as check } from "./check.js";
import { register as uncheck } from "./uncheck.js";
import { register as drag } from "./drag.js";
import { register as upload } from "./upload.js";
import { register as scroll } from "./scroll.js";
// Batch 2: Information retrieval
import { register as title } from "./title.js";
import { register as url } from "./url.js";
import { register as value } from "./value.js";
import { register as count } from "./count.js";
import { register as box } from "./box.js";
import { register as styles } from "./styles.js";
import { register as visible } from "./visible.js";
import { register as enabled } from "./enabled.js";
import { register as checked } from "./checked.js";
// Batch 3: Snapshot
import { register as snapshot } from "./snapshot.js";
// Batch 4: Advanced
import { register as pdf } from "./pdf.js";
import { register as console_ } from "./console.js";
import { register as errors } from "./errors.js";
import { register as dialog } from "./dialog.js";
import { register as frame } from "./frame.js";
import { register as storage } from "./storage.js";
import { register as device } from "./device.js";
// Batch 5: State
import { register as state } from "./state.js";

const commands = [
  go, back, forward, reload,
  source, links, forms, evalCmd,
  html, attr,
  click, clicksel, focus, type_, fill, select,
  screenshot,
  wait, waitfor, press,
  sleep,
  cookie, viewport, useragent, network,
  quit, tabs, status, stop,
  // Batch 1
  dblclick, hover, check, uncheck, drag, upload, scroll,
  // Batch 2
  title, url, value, count, box, styles, visible, enabled, checked,
  // Batch 3
  snapshot,
  // Batch 4
  pdf, console_, errors, dialog, frame, storage, device,
  // Batch 5
  state,
];

export function registerAll(program: Command): void {
  for (const register of commands) {
    register(program);
  }
}
