import TransitionProvider from "./transition_provider.ts";
import { expect, ParamReturn } from "../dev_deps.ts";
import { renderToString } from "react-dom/server";

Deno.test("render as SSR", () => {
  const table: ParamReturn<typeof renderToString>[] = [
    [
      <TransitionProvider enter="transition" enterTo="opacity-0" isShow>
        <div>test</div>
      </TransitionProvider>,
      `<div class=""><div>test</div></div>`,
    ],
    [
      <TransitionProvider enter="transition" enterTo="opacity-0" isShow>
        <div className="test">test</div>
      </TransitionProvider>,
      `<div class="test"><div>test</div></div>`,
    ],
    [
      <TransitionProvider enter="transition" isShow={false}>
        <div>test</div>
      </TransitionProvider>,
      `<div class=""></div>`,
    ],
  ];

  table.forEach(([element, result]) =>
    expect(renderToString(element)).toBe(result)
  );
});
