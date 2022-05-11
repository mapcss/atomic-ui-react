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
