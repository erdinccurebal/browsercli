import type { Page } from "playwright";
import path from "node:path";
import { isRef, getRef } from "../ref-store.js";

export async function click(
  page: Page,
  text: string,
  waitAfterClick = 500,
): Promise<{ clicked: string; url: string }> {
  if (isRef(text)) {
    const el = getRef(page, text);
    if (!el) throw new Error(`Ref ${text} not found. Run "snapshot" first.`);
    await el.click();
    await page.waitForTimeout(waitAfterClick);
    return { clicked: text, url: page.url() };
  }

  const locator = page
    .getByText(text, { exact: false })
    .or(page.getByRole("button", { name: text }))
    .or(page.getByRole("link", { name: text }))
    .or(page.getByLabel(text));

  await locator.first().click();
  await page.waitForTimeout(waitAfterClick);
  return { clicked: text, url: page.url() };
}

export async function clicksel(
  page: Page,
  selector: string,
  waitAfterClick = 500,
): Promise<{ selector: string; url: string }> {
  if (isRef(selector)) {
    const el = getRef(page, selector);
    if (!el) throw new Error(`Ref ${selector} not found. Run "snapshot" first.`);
    await el.click();
    await page.waitForTimeout(waitAfterClick);
    return { selector, url: page.url() };
  }
  await page.click(selector);
  await page.waitForTimeout(waitAfterClick);
  return { selector, url: page.url() };
}

export async function focus(
  page: Page,
  selector: string,
): Promise<{ selector: string }> {
  if (isRef(selector)) {
    const el = getRef(page, selector);
    if (!el) throw new Error(`Ref ${selector} not found. Run "snapshot" first.`);
    await el.focus();
    return { selector };
  }
  await page.focus(selector);
  return { selector };
}

export async function press(
  page: Page,
  key: string,
  waitAfterPress = 300,
): Promise<{ key: string; url: string }> {
  await page.keyboard.press(key);
  await page.waitForTimeout(waitAfterPress);
  return { key, url: page.url() };
}

export async function type(
  page: Page,
  text: string
): Promise<{ typed: string }> {
  await page.keyboard.type(text);
  return { typed: text };
}

export async function fill(
  page: Page,
  selector: string,
  value: string
): Promise<{ selector: string; value: string }> {
  if (isRef(selector)) {
    const el = getRef(page, selector);
    if (!el) throw new Error(`Ref ${selector} not found. Run "snapshot" first.`);
    await el.fill(value);
    return { selector, value };
  }
  await page.fill(selector, value);
  return { selector, value };
}

export async function select(
  page: Page,
  selector: string,
  value: string
): Promise<{ selector: string; value: string }> {
  if (isRef(selector)) {
    const el = getRef(page, selector);
    if (!el) throw new Error(`Ref ${selector} not found. Run "snapshot" first.`);
    await el.selectOption(value);
    return { selector, value };
  }
  await page.selectOption(selector, value);
  return { selector, value };
}

export async function dblclick(
  page: Page,
  text: string,
  waitAfterClick = 500,
): Promise<{ clicked: string; url: string }> {
  if (isRef(text)) {
    const el = getRef(page, text);
    if (!el) throw new Error(`Ref ${text} not found. Run "snapshot" first.`);
    await el.dblclick();
    await page.waitForTimeout(waitAfterClick);
    return { clicked: text, url: page.url() };
  }

  const locator = page
    .getByText(text, { exact: false })
    .or(page.getByRole("button", { name: text }))
    .or(page.getByRole("link", { name: text }))
    .or(page.getByLabel(text));

  await locator.first().dblclick();
  await page.waitForTimeout(waitAfterClick);
  return { clicked: text, url: page.url() };
}

export async function hover(
  page: Page,
  selector: string,
): Promise<{ selector: string }> {
  if (isRef(selector)) {
    const el = getRef(page, selector);
    if (!el) throw new Error(`Ref ${selector} not found. Run "snapshot" first.`);
    await el.hover();
    return { selector };
  }
  await page.hover(selector);
  return { selector };
}

export async function check(
  page: Page,
  selector: string,
): Promise<{ selector: string; checked: true }> {
  if (isRef(selector)) {
    const el = getRef(page, selector);
    if (!el) throw new Error(`Ref ${selector} not found. Run "snapshot" first.`);
    await el.check();
    return { selector, checked: true };
  }
  await page.check(selector);
  return { selector, checked: true };
}

export async function uncheck(
  page: Page,
  selector: string,
): Promise<{ selector: string; checked: false }> {
  if (isRef(selector)) {
    const el = getRef(page, selector);
    if (!el) throw new Error(`Ref ${selector} not found. Run "snapshot" first.`);
    await el.uncheck();
    return { selector, checked: false };
  }
  await page.uncheck(selector);
  return { selector, checked: false };
}

export async function drag(
  page: Page,
  from: string,
  to: string,
): Promise<{ from: string; to: string }> {
  await page.dragAndDrop(from, to);
  return { from, to };
}

export async function upload(
  page: Page,
  selector: string,
  filePath: string,
): Promise<{ selector: string; file: string }> {
  const resolved = path.resolve(filePath);
  await page.setInputFiles(selector, resolved);
  return { selector, file: resolved };
}

export async function scroll(
  page: Page,
  direction: "up" | "down" | "left" | "right",
  amount = 500,
): Promise<{ direction: string; amount: number }> {
  const deltaX = direction === "left" ? -amount : direction === "right" ? amount : 0;
  const deltaY = direction === "up" ? -amount : direction === "down" ? amount : 0;
  await page.mouse.wheel(deltaX, deltaY);
  return { direction, amount };
}
