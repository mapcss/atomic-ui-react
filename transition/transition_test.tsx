import Transition from "./transition.tsx";
import {
  defineGlobalThis,
  expect,
  ParamReturn,
  setupJSDOM,
  setupRaf,
} from "../dev_deps.ts";
import { renderToString } from "react-dom/server";

Deno.test("render as SSR", () => {
  const table: ParamReturn<typeof renderToString>[] = [
    [
      <Transition enter="transition" show>
        <div>test</div>
      </Transition>,
      `<div class=""><div>test</div></div>`,
    ],
    [
      <Transition enter="transition" show={false}>
        <div>test</div>
      </Transition>,
      `<div class=""></div>`,
    ],
  ];

  table.forEach(([element, result]) =>
    expect(renderToString(element)).toBe(result)
  );
});

Deno.test(
  "Transition initial class name is empty",
  async () => {
    setupJSDOM();
    await setupRaf();

    const reset = defineGlobalThis("getComputedStyle", () => {
      const css = { transitionDuration: "3s" } as CSSStyleDeclaration;
      return css;
    });

    const { render } = await import("@testing-library/react");

    const result = render(
      <Transition data-testid="test" enter="transition" show>
        <div>test</div>
      </Transition>,
    );

    expect(result.getByTestId("test").className).toBe("");
    expect(result.getByTestId("test").innerHTML).toBe("<div>test</div>");

    result.rerender(
      <Transition data-testid="test" enter="transition" show={false}>
        <div>test</div>
      </Transition>,
    );
    expect(result.getByTestId("test").className).toBe("");
    expect(result.getByTestId("test").innerHTML).toBe("<div>test</div>");

    result.unmount();
    reset();
  },
);
