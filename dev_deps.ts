export {
  anyBoolean,
  anyFunction,
  anyNumber,
  anyObject,
  anyOf,
  anyString,
  defineExpect,
  defineGlobalThis,
  fn,
  jestMatcherMap,
  jestModifierMap,
} from "https://deno.land/x/unitest@v1.0.0-beta.82/mod.ts";
import {
  defineExpect,
  equal,
  jestMatcherMap,
  jestModifierMap,
  MatchResult,
} from "https://deno.land/x/unitest@v1.0.0-beta.82/mod.ts";
export { FakeTime } from "https://deno.land/std@0.136.0/testing/time.ts";
export { describe, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
export { assertSnapshot } from "https://deno.land/std@0.136.0/testing/snapshot.ts";
export { default as clsx } from "https://esm.sh/clsx@1.1.1?pin=v78";
import { isNumber } from "https://deno.land/x/isx@v1.0.0-beta.17/mod.ts";
export async function setupJSDOM(): Promise<void> {
  const { JSDOM } = await import("https://esm.sh/jsdom@19.0.0?pin=v76").then((
    module,
  ) => module.default);

  const doc = new JSDOM(`<!DOCTYPE html>`);
  globalThis.document = doc.window.document;
  globalThis.HTMLIFrameElement = doc.window.HTMLIFrameElement;
  globalThis.HTMLElement = doc.window.HTMLElement;
  globalThis.SVGElement = doc.window.SVGElement;

  globalThis.Node = doc.window.Node;
}
export const expect = defineExpect({
  matcherMap: {
    ...jestMatcherMap,
    toHaveFocus,
    toHaveAttribute,
  },
  modifierMap: jestModifierMap,
});

function toHaveFocus(value: Element): MatchResult {
  return {
    pass: value.ownerDocument.activeElement === value,
    expected: "Actual element is focused",
  };
}

function toHaveAttribute(
  el: Element,
  name: string,
  expected: unknown,
): MatchResult {
  if (!el.hasAttribute(name)) {
    return {
      pass: false,
      expected: `[${name}] is not exists`,
    };
  }
  return {
    pass: equal(el.getAttribute(name), expected),
    actualHint: `Actual ${name}:`,
    resultActual: el.getAttribute(name),
    expectedHint: `Expected ${name}:`,
    expected,
  };
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

class MockIntersectionObserver {
  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit,
  ) {
  }

  get root(): Element | Document | null {
    return this.options?.root ?? null;
  }

  get rootMargin(): string {
    return this.options?.rootMargin ?? "";
  }

  get thresholds(): ReadonlyArray<number> {
    return isNumber(this.options?.threshold) ? [] : [];
  }

  public disconnect(): void {}

  public observe(_: Element): void {}

  public takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  unobserve(_: Element): void {}
}

export function setupIntersectionObserver() {
  globalThis.IntersectionObserver = MockIntersectionObserver;
}
