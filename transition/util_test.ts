import { getDuration, isShowable } from "./util.ts";
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
    [true, { isCompleted: true, isActivated: true }, true],
    [true, { isCompleted: true, isActivated: false }, true],
    [true, { isCompleted: false, isActivated: true }, true],
    [true, { isCompleted: false, isActivated: false }, true],
    [false, { isCompleted: true, isActivated: true }, false],
    [false, { isCompleted: true, isActivated: false }, false],
    [false, { isCompleted: false, isActivated: true }, true],
    [false, { isCompleted: false, isActivated: false }, false],
  ];
  table.forEach(([isShow, isCompleted, result]) =>
    expect(isShowable(isShow, isCompleted)).toBe(result)
  );
});
