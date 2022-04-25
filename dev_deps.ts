export {
  defineGlobalThis,
  expect,
  fn,
} from "https://deno.land/x/unitest@v1.0.0-beta.82/mod.ts";
export { FakeTime } from "https://deno.land/std@0.136.0/testing/time.ts";
export { describe, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
export { assertSnapshot } from "https://deno.land/std@0.136.0/testing/snapshot.ts";
export async function setupJSDOM(): Promise<void> {
  const { JSDOM } = await import("https://esm.sh/jsdom@19.0.0?pin=v76").then((
    module,
  ) => module.default);

  const doc = new JSDOM(`<!DOCTYPE html>`);
  globalThis.document = doc.window.document;
  globalThis.HTMLIFrameElement = doc.window.HTMLIFrameElement;
}

export function setupRaf(): () => void {
  Object.defineProperty(globalThis.window, "requestAnimationFrame", {
    value: (handler: TimerHandler) => globalThis.setTimeout(handler, 1),
    configurable: true,
    writable: true,
  });

  Object.defineProperty(globalThis.window, "cancelAnimationFrame", {
    value: globalThis.clearTimeout,
    configurable: true,
    writable: true,
  });

  const reset = (): void => {
    globalThis.requestAnimationFrame = _.requestAnimationFrame;
    globalThis.cancelAnimationFrame = _.cancelAnimationFrame;
  };

  return reset;
}

// deno-lint-ignore no-explicit-any
export type ParamReturn<T extends (...args: any[]) => unknown> = [
  ...Parameters<T>,
  ReturnType<T>,
];

const _: {
  getComputedStyle: typeof window.getComputedStyle;
  requestAnimationFrame: typeof globalThis.requestAnimationFrame;
  cancelAnimationFrame: typeof cancelAnimationFrame;
} = {
  getComputedStyle: globalThis.getComputedStyle,
  requestAnimationFrame: globalThis.requestAnimationFrame,
  cancelAnimationFrame: globalThis.cancelAnimationFrame,
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
