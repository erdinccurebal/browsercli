import type { Page } from "playwright";
import fs from "node:fs";
import { resolve } from "node:path";

interface BrowserState {
  cookies: unknown[];
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
  url: string;
}

export async function saveState(
  page: Page,
  outputPath?: string,
): Promise<{ path: string }> {
  const context = page.context();
  const cookies = await context.cookies();

  const { local, session } = await page.evaluate(() => {
    const local: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k) local[k] = localStorage.getItem(k) || "";
    }
    const session: Record<string, string> = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      if (k) session[k] = sessionStorage.getItem(k) || "";
    }
    return { local, session };
  });

  const state: BrowserState = {
    cookies,
    localStorage: local,
    sessionStorage: session,
    url: page.url(),
  };

  const filename = outputPath || `state-${Date.now()}.json`;
  const fullPath = resolve(filename);
  fs.writeFileSync(fullPath, JSON.stringify(state, null, 2));
  return { path: fullPath };
}

export async function loadState(
  page: Page,
  inputPath: string,
): Promise<{ loaded: boolean; url: string }> {
  const fullPath = resolve(inputPath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  const state: BrowserState = JSON.parse(raw);

  const context = page.context();
  await context.addCookies(state.cookies as Parameters<typeof context.addCookies>[0]);

  if (state.url && state.url !== "about:blank") {
    await page.goto(state.url, { waitUntil: "domcontentloaded" });
  }

  await page.evaluate(({ local, session }) => {
    for (const [k, v] of Object.entries(local)) {
      localStorage.setItem(k, v);
    }
    for (const [k, v] of Object.entries(session)) {
      sessionStorage.setItem(k, v);
    }
  }, { local: state.localStorage, session: state.sessionStorage });

  return { loaded: true, url: state.url };
}
