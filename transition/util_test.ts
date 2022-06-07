import { getDuration } from "./util.ts";
import { defineGlobalThis, expect, setupJSDOM } from "../dev_deps.ts";

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
