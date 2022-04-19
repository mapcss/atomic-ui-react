import { getDuration, isShowable } from "./util.ts";
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

Deno.test("isShowable", () => {
  const table: ParamReturn<typeof isShowable>[] = [
    [true, true, true],
    [true, false, true],
    [false, true, false],
    [false, false, true],
  ];
  table.forEach(([isShow, isCompleted, result]) =>
    expect(isShowable(isShow, isCompleted)).toBe(result)
  );
});
