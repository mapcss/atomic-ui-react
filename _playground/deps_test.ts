export {
  defineGlobalThis,
  expect,
  fn,
  useFakeTimer,
} from "https://deno.land/x/unitest@v1.0.0-beta.82/mod.ts";

import jsdom from "https://esm.sh/jsdom@19.0.0?pin=v76";

export function setupJSDOM(): void {
  const { JSDOM } = jsdom;
  const doc = new JSDOM(`<!DOCTYPE html>`);
  globalThis.document = doc.window.document;
  globalThis.HTMLIFrameElement = doc.window.HTMLIFrameElement;
}

export function setupRaf(): Promise<void> {
  return import("https://esm.sh/raf/polyfill");
}



// deno-lint-ignore no-explicit-any
export type ParamReturn<T extends (...args: any[]) => unknown> = [
  ...Parameters<T>,
  ReturnType<T>,
];
