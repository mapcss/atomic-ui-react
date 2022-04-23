export {
  defineGlobalThis,
  expect,
  fn,
  useFakeTimer,
} from "https://deno.land/x/unitest@v1.0.0-beta.82/mod.ts";
export { FakeTime } from "https://deno.land/std@0.136.0/testing/time.ts";
export { describe, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";

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

export function setupGetComputedStyle() {
  if (!window.getComputedStyle) {
    const getComputedStyle = (
      el: HTMLElement,
      pseudoElt?: string | null | undefined,
    ): CSSStyleDeclaration => {
      if (pseudoElt) {
        throw Error("pseudoElt is not implemented.");
      }
      return el.style;
    };
    Object.defineProperty(window, "getComputedStyle", {
      value: getComputedStyle,
    });
  }
}

// deno-lint-ignore no-explicit-any
export type ParamReturn<T extends (...args: any[]) => unknown> = [
  ...Parameters<T>,
  ReturnType<T>,
];

const _: { getComputedStyle: typeof window.getComputedStyle } = {
  getComputedStyle: globalThis.getComputedStyle,
};

export function mockGetComputedStyle(mock: () => CSSStyleDeclaration) {
  Object.defineProperty(globalThis.window, "getComputedStyle", {
    value: mock,
    writable: true,
    configurable: true,
  });

  const reset = (): void => {
    globalThis.getComputedStyle = _.getComputedStyle;
  };

  return reset;
}
