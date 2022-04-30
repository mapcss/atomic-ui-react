import { isBrowser } from "./util.ts";
import { describe, expect, it, setupJSDOM } from "./dev_deps.ts";
import { resolveElementLike } from "./util.ts";

Deno.test("isBrowser", () => {
  expect(isBrowser).toBeFalsy();
});

const resolveElementTest = describe({
  name: "resolveElementLike",
  beforeAll: setupJSDOM,
});

it(resolveElementTest, "should return element or undefined/null", () => {
  const el = globalThis.document.createElement("div");
  expect(resolveElementLike(null)).toBe(null);
  expect(resolveElementLike(undefined)).toBe(undefined);
  expect(resolveElementLike(el)).toEqual(el);
  expect(resolveElementLike(() => el)).toEqual(el);
  expect(resolveElementLike(() => undefined)).toBe(undefined);
  expect(resolveElementLike({ current: el })).toEqual(el);
});
