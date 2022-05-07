import { cleanTokens, getDuration, isShowable, tokenize } from "./util.ts";
import {
  defineGlobalThis,
  expect,
  ParamReturn,
  setupJSDOM,
} from "../dev_deps.ts";

Deno.test("getDuration", async () => {
  await setupJSDOM();
  const reset = defineGlobalThis("getComputedStyle", () => {
    const css = { transitionDuration: "3s" } as CSSStyleDeclaration;
    return css;
  });

  const el = document.createElement("div");

  expect(getDuration(el)).toBe(3000);
  reset();
});

Deno.test("isShowable", () => {
  const table: ParamReturn<typeof isShowable>[] = [
    [true, { isCompleted: true, isActivated: true, hasLeaved: false }, true],
    [true, { isCompleted: true, isActivated: false, hasLeaved: false }, true],
    [true, { isCompleted: false, isActivated: true, hasLeaved: false }, true],
    [true, { isCompleted: false, isActivated: false, hasLeaved: false }, true],
    [false, { isCompleted: true, isActivated: true, hasLeaved: false }, false],
    [false, { isCompleted: true, isActivated: false, hasLeaved: false }, false],
    [false, { isCompleted: false, isActivated: true, hasLeaved: false }, true],
    [
      false,
      { isCompleted: false, isActivated: false, hasLeaved: false },
      false,
    ],
  ];
  table.forEach(([isShow, isCompleted, result]) =>
    expect(isShowable(isShow, isCompleted)).toBe(result)
  );
});

Deno.test("tokenize", () => {
  const table: ParamReturn<typeof tokenize>[] = [
    ["", []],
    [" ", []],
    ["       ", []],
    ["a", ["a"]],
    ["a b", ["a", "b"]],
    ["   a b,  c  d  ,e ", ["a", "b,", "c", "d", ",e"]],
    [" a a b b ", ["a", "a", "b", "b"]],
  ];
  table.forEach(([value, result]) => expect(tokenize(value)).toEqual(result));
});

Deno.test("cleanTokens", () => {
  const table: ParamReturn<typeof cleanTokens>[] = [
    [[], []],
    [[""], []],
    [[undefined], []],
    [[undefined, "a", undefined], ["a"]],
    [["       ", "      "], []],
    [["a"], ["a"]],
    [["a", "b"], ["a", "b"]],
    [["a a a", "b"], ["a", "b"]],
    [["  a  b  c  ", "b", " cd ef ghi ", " jkl "], [
      "a",
      "b",
      "c",
      "cd",
      "ef",
      "ghi",
      "jkl",
    ]],
  ];
  table.forEach(([value, result]) =>
    expect(cleanTokens(value)).toEqual(result)
  );
});
