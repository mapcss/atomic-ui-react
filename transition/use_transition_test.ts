import { getDuration, joinCharacters } from "./use_transition.ts";
import {
  defineGlobalThis,
  expect,
  ParamReturn,
  setupJSDOM,
} from "../dev_deps.ts";

Deno.test("getDuration", () => {
  setupJSDOM();
  const reset = defineGlobalThis("getComputedStyle", () => {
    const css = { transitionDuration: "3s" } as CSSStyleDeclaration;
    return css;
  });

  const el = document.createElement("div");

  expect(getDuration(el)).toBe(3000);
  reset();
});

Deno.test("joinCharacters", () => {
  const table: ParamReturn<typeof joinCharacters>[] = [
    [[""], ""],
    [[undefined], ""],
    [[undefined, undefined], ""],
    [[undefined, undefined, ""], ""],
    [[" "], ""],
    [[undefined, undefined, " "], ""],
    [["test"], "test"],
    [[" test "], "test"],
    [["test", "test2"], "test test2"],
    [[" test ", "tes t"], "test tes t"],
    [
      ["", "a", " b", undefined, "c ", " d ", " ef g ", undefined],
      "a b c d ef g",
    ],
    [
      ["ab", "ab"],
      "ab ab",
    ],
  ];
  table.forEach(([value, result]) =>
    expect(joinCharacters(value)).toBe(result)
  );
});
