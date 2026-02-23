import { registerHandler } from "../handler-registry.js";
import { requireString, requireUrl, optionalString, optionalNumber } from "../validate.js";
import * as navigate from "../actions/navigate.js";
import * as read from "../actions/read.js";
import * as interact from "../actions/interact.js";
import * as wait from "../actions/wait.js";
import * as cookie from "../actions/cookie.js";
import * as browser from "../actions/browser.js";
import * as network from "../actions/network.js";
import { screenshot, screenshotAnnotated } from "../actions/screenshot.js";
import { snapshot } from "../actions/snapshot.js";
import { pdf } from "../actions/pdf.js";
import * as consoleActions from "../actions/console.js";
import * as dialog from "../actions/dialog.js";
import * as frame from "../actions/frame.js";
import * as storage from "../actions/storage.js";
import * as state from "../actions/state.js";

export function registerAllHandlers(): void {
  // --- Tab-independent ---

  registerHandler("tabs", async (ctx) => ({
    ok: true, data: ctx.tabManager.list(),
  }), { needsPage: false });

  registerHandler("status", async (ctx) => ({
    ok: true,
    data: { pid: process.pid, tabs: ctx.tabManager.list(), uptime: process.uptime() },
  }), { needsPage: false });

  registerHandler("stop", async (ctx) => {
    setTimeout(() => ctx.shutdown(), 100);
    return { ok: true, data: { stopping: true } };
  }, { needsPage: false });

  registerHandler("quit", async (ctx, req) => {
    await ctx.tabManager.close(req.tab);
    return { ok: true, data: { tab: req.tab, closed: true } };
  }, { needsPage: false });

  // --- Navigation ---

  registerHandler("go", async (_ctx, req, page) => {
    const url = requireUrl(req.args, "url");
    const waitUntil = (optionalString(req.args, "waitUntil") as "domcontentloaded" | "networkidle" | "load") || "domcontentloaded";
    return { ok: true, data: await navigate.go(page!, url, waitUntil) };
  }, { needsPage: true, createsTab: true });

  registerHandler("back", async (_ctx, _req, page) => ({
    ok: true, data: await navigate.back(page!),
  }));

  registerHandler("forward", async (_ctx, _req, page) => ({
    ok: true, data: await navigate.forward(page!),
  }));

  registerHandler("reload", async (_ctx, _req, page) => ({
    ok: true, data: await navigate.reload(page!),
  }));

  // --- Reading ---

  registerHandler("source", async (_ctx, _req, page) => ({
    ok: true, data: await read.source(page!),
  }));

  registerHandler("links", async (_ctx, _req, page) => ({
    ok: true, data: await read.links(page!),
  }));

  registerHandler("forms", async (_ctx, _req, page) => ({
    ok: true, data: await read.forms(page!),
  }));

  registerHandler("eval", async (_ctx, req, page) => {
    const js = requireString(req.args, "js", "JavaScript code");
    return { ok: true, data: await read.evaluate(page!, js) };
  });

  registerHandler("html", async (_ctx, req, page) => {
    const selector = requireString(req.args, "selector");
    return { ok: true, data: await read.html(page!, selector) };
  });

  registerHandler("attr", async (_ctx, req, page) => {
    const selector = requireString(req.args, "selector");
    const attribute = requireString(req.args, "attribute");
    return { ok: true, data: await read.attr(page!, selector, attribute) };
  });

  registerHandler("title", async (_ctx, _req, page) => ({
    ok: true, data: await read.title(page!),
  }));

  registerHandler("url", async (_ctx, _req, page) => ({
    ok: true, data: await read.url(page!),
  }));

  registerHandler("value", async (_ctx, req, page) => {
    const selector = requireString(req.args, "selector");
    return { ok: true, data: await read.value(page!, selector) };
  });

  registerHandler("count", async (_ctx, req, page) => {
    const selector = requireString(req.args, "selector");
    return { ok: true, data: await read.count(page!, selector) };
  });

  registerHandler("box", async (_ctx, req, page) => {
    const selector = requireString(req.args, "selector");
    return { ok: true, data: await read.box(page!, selector) };
  });

  registerHandler("styles", async (_ctx, req, page) => {
    const selector = requireString(req.args, "selector");
    const props = req.args.props as string[] | undefined;
    return { ok: true, data: await read.styles(page!, selector, props) };
  });

  registerHandler("visible", async (_ctx, req, page) => {
    const selector = requireString(req.args, "selector");
    return { ok: true, data: await read.visible(page!, selector) };
  });

  registerHandler("enabled", async (_ctx, req, page) => {
    const selector = requireString(req.args, "selector");
    return { ok: true, data: await read.enabled(page!, selector) };
  });

  registerHandler("checked", async (_ctx, req, page) => {
    const selector = requireString(req.args, "selector");
    return { ok: true, data: await read.checked(page!, selector) };
  });

  // --- Interaction ---

  registerHandler("click", async (ctx, req, page) => {
    const text = requireString(req.args, "text");
    return { ok: true, data: await interact.click(page!, text, ctx.config.waitAfterClick) };
  });

  registerHandler("clicksel", async (ctx, req, page) => {
    const selector = requireString(req.args, "selector");
    return { ok: true, data: await interact.clicksel(page!, selector, ctx.config.waitAfterClick) };
  });

  registerHandler("focus", async (_ctx, req, page) => {
    const selector = requireString(req.args, "selector");
    return { ok: true, data: await interact.focus(page!, selector) };
  });

  registerHandler("type", async (_ctx, req, page) => {
    const text = requireString(req.args, "text");
    return { ok: true, data: await interact.type(page!, text) };
  });

  registerHandler("fill", async (_ctx, req, page) => {
    const selector = requireString(req.args, "selector");
    const value = requireString(req.args, "value");
    return { ok: true, data: await interact.fill(page!, selector, value) };
  });

  registerHandler("select", async (_ctx, req, page) => {
    const selector = requireString(req.args, "selector");
    const value = requireString(req.args, "value");
    return { ok: true, data: await interact.select(page!, selector, value) };
  });

  registerHandler("press", async (ctx, req, page) => {
    const key = requireString(req.args, "key");
    return { ok: true, data: await interact.press(page!, key, ctx.config.waitAfterPress) };
  });

  registerHandler("dblclick", async (ctx, req, page) => {
    const text = requireString(req.args, "text");
    return { ok: true, data: await interact.dblclick(page!, text, ctx.config.waitAfterClick) };
  });

  registerHandler("hover", async (_ctx, req, page) => {
    const selector = requireString(req.args, "selector");
    return { ok: true, data: await interact.hover(page!, selector) };
  });

  registerHandler("check", async (_ctx, req, page) => {
    const selector = requireString(req.args, "selector");
    return { ok: true, data: await interact.check(page!, selector) };
  });

  registerHandler("uncheck", async (_ctx, req, page) => {
    const selector = requireString(req.args, "selector");
    return { ok: true, data: await interact.uncheck(page!, selector) };
  });

  registerHandler("drag", async (_ctx, req, page) => {
    const from = requireString(req.args, "from");
    const to = requireString(req.args, "to");
    return { ok: true, data: await interact.drag(page!, from, to) };
  });

  registerHandler("upload", async (_ctx, req, page) => {
    const selector = requireString(req.args, "selector");
    const filePath = requireString(req.args, "filePath");
    return { ok: true, data: await interact.upload(page!, selector, filePath) };
  });

  registerHandler("scroll", async (_ctx, req, page) => {
    const direction = requireString(req.args, "direction") as "up" | "down" | "left" | "right";
    const amount = optionalNumber(req.args, "amount");
    return { ok: true, data: await interact.scroll(page!, direction, amount) };
  });

  // --- Wait ---

  registerHandler("wait", async (_ctx, req, page) => {
    const selector = requireString(req.args, "selector");
    const timeout = optionalNumber(req.args, "waitTimeout") || 10000;
    return { ok: true, data: await wait.waitForSelector(page!, selector, timeout) };
  });

  registerHandler("waitfor", async (_ctx, req, page) => {
    const text = requireString(req.args, "text");
    const timeout = optionalNumber(req.args, "waitTimeout") || 10000;
    return { ok: true, data: await wait.waitForText(page!, text, timeout) };
  });

  // --- Screenshot ---

  registerHandler("screenshot", async (_ctx, req, page) => {
    const output = optionalString(req.args, "output");
    const fullPage = req.args.fullPage !== false;
    return { ok: true, data: await screenshot(page!, output, { fullPage }) };
  });

  registerHandler("screenshot-annotated", async (_ctx, req, page) => {
    const output = optionalString(req.args, "output");
    return { ok: true, data: await screenshotAnnotated(page!, output) };
  });

  // --- Snapshot ---

  registerHandler("snapshot", async (_ctx, req, page) => {
    const interactiveOnly = req.args.interactiveOnly !== false;
    const maxDepth = optionalNumber(req.args, "maxDepth");
    return { ok: true, data: await snapshot(page!, { interactiveOnly, maxDepth }) };
  });

  // --- PDF ---

  registerHandler("pdf", async (_ctx, req, page) => {
    const output = optionalString(req.args, "output");
    return { ok: true, data: await pdf(page!, output) };
  });

  // --- Console & Errors ---

  registerHandler("console", async (_ctx, req, page) => {
    const mode = optionalString(req.args, "mode") || "show";
    if (mode === "on") return { ok: true, data: consoleActions.enableConsoleLogging(page!) };
    if (mode === "off") return { ok: true, data: consoleActions.disableConsoleLogging(page!) };
    const logs = consoleActions.getConsoleLogs(page!);
    return { ok: true, data: { logs } };
  });

  registerHandler("errors", async (_ctx, _req, page) => {
    const errors = consoleActions.getErrors(page!);
    return { ok: true, data: { errors } };
  });

  // --- Dialog ---

  registerHandler("dialog", async (_ctx, req, page) => {
    const action = requireString(req.args, "action");
    const promptText = optionalString(req.args, "promptText");
    if (action === "accept") return { ok: true, data: await dialog.acceptDialog(page!, promptText) };
    if (action === "dismiss") return { ok: true, data: await dialog.dismissDialog(page!) };
    throw new Error(`Unknown dialog action: ${action}. Use "accept" or "dismiss".`);
  });

  // --- Frame ---

  registerHandler("frame", async (_ctx, req, page) => {
    const selector = requireString(req.args, "selector");
    return { ok: true, data: await frame.switchToFrame(page!, selector) };
  });

  registerHandler("frame-main", async (_ctx, _req, page) => ({
    ok: true, data: frame.switchToMain(page!),
  }));

  // --- Storage ---

  registerHandler("storage", async (_ctx, req, page) => {
    const action = requireString(req.args, "action");
    if (action === "get") {
      const key = optionalString(req.args, "key");
      return { ok: true, data: await storage.storageGet(page!, key) };
    }
    if (action === "set") {
      const key = requireString(req.args, "key");
      const value = requireString(req.args, "value");
      return { ok: true, data: await storage.storageSet(page!, key, value) };
    }
    if (action === "clear") {
      return { ok: true, data: await storage.storageClear(page!) };
    }
    throw new Error(`Unknown storage action: ${action}. Use "get", "set", or "clear".`);
  });

  // --- Device ---

  registerHandler("device", async (_ctx, req, page) => {
    const deviceName = requireString(req.args, "device");
    return { ok: true, data: await browser.setDevice(page!, deviceName) };
  });

  // --- Cookie ---

  registerHandler("cookie-export", async (_ctx, _req, page) => ({
    ok: true, data: await cookie.exportCookies(page!),
  }));

  registerHandler("cookie-import", async (_ctx, req, page) => {
    const cookies = req.args.cookies;
    if (!Array.isArray(cookies)) throw new Error("cookies must be an array");
    return { ok: true, data: await cookie.importCookies(page!, cookies) };
  });

  // --- State ---

  registerHandler("state-save", async (_ctx, req, page) => {
    const output = optionalString(req.args, "output");
    return { ok: true, data: await state.saveState(page!, output) };
  });

  registerHandler("state-load", async (_ctx, req, page) => {
    const input = requireString(req.args, "input");
    return { ok: true, data: await state.loadState(page!, input) };
  });

  // --- Browser settings ---

  registerHandler("viewport", async (_ctx, req, page) => {
    const width = req.args.width as number;
    const height = req.args.height as number;
    if (!width || !height) throw new Error("width and height are required");
    return { ok: true, data: await browser.setViewport(page!, width, height) };
  });

  registerHandler("useragent", async (_ctx, req, page) => {
    const ua = requireString(req.args, "userAgent");
    return { ok: true, data: await browser.setUserAgent(page!, ua) };
  });

  registerHandler("network", async (_ctx, req, page) => {
    const mode = optionalString(req.args, "mode") || "status";
    if (mode === "on") return { ok: true, data: network.enableNetworkLogging(page!) };
    if (mode === "off") return { ok: true, data: network.disableNetworkLogging(page!) };
    // status: return recent logs
    const logs = network.getNetworkLogs(page!);
    return { ok: true, data: { logs } };
  });
}
