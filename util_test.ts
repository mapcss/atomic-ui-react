import { cleanCharacter, isBrowser, joinChars } from "./util.ts";
import { describe, expect, it, ParamReturn, setupJSDOM } from "./dev_deps.ts";
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

Deno.test("joinChars", () => {
  const table: ParamReturn<typeof joinChars>[] = [
    [[""], " ", undefined],
    [[undefined], " ", undefined],
    [[undefined, undefined], " ", undefined],
    [[undefined, undefined, ""], " ", undefined],
    [[" "], " ", undefined],
    [[undefined, undefined, " "], " ", undefined],
    [["test"], " ", "test"],
    [[" test "], " ", "test"],
    [["test", "test2"], " ", "test test2"],
    [[" test ", "tes t"], " ", "test tes t"],
    [
      ["", "a", " b", undefined, "c ", " d ", " ef g ", undefined],
      " ",
      "a b c d ef g",
    ],
    [
      ["ab", "ab"],
      " ",
      "ab ab",
    ],
    [
      ["id", undefined, "2 "],
      "-",
      "id-2",
    ],
    [
      ["id", undefined, "2", " "],
      "-",
      "id-2",
    ],
    [
      ["id", undefined, "    ", "2", " ", "  3 "],
      "-",
      "id-2-3",
    ],
    [
      [0, 1, "2", "3"],
      "-",
      "0-1-2-3",
    ],
  ];
  table.forEach(([value, separator, result]) =>
    expect(joinChars(value, separator)).toBe(result)
  );
});

Deno.test("cleanCharacter", () => {
  const table: ParamReturn<typeof cleanCharacter>[] = [
    ["", ""],
    ["   ", ""],
    ["This  is sunny !   ", "This is sunny !"],
  ];

  table.forEach(([value, result]) =>
    expect(cleanCharacter(value)).toBe(result)
  );
});
