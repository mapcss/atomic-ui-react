import TransitionProvider from "./transition_provider.ts";
import { expect, ParamReturn } from "../dev_deps.ts";
import { renderToString } from "react-dom/server";

Deno.test("render as SSR", () => {
  const table: ParamReturn<typeof renderToString>[] = [
    [
      <TransitionProvider enter="transition" enterTo="opacity-0" isShow>
        <div>test</div>
      </TransitionProvider>,
      `<div class="">test</div>`,
    ],
    [
      <TransitionProvider enter="transition" enterTo="opacity-0" isShow>
        <div className="test">test</div>
      </TransitionProvider>,
      `<div class="test">test</div>`,
    ],
    [
      <TransitionProvider
        enter="transition"
        enterFrom="opacity-0"
        isShow
        immediate
      >
        <div>test</div>
      </TransitionProvider>,
      `<div class="opacity-0">test</div>`,
    ],
    [
      <TransitionProvider
        enter="transition"
        enterFrom="opacity-0"
        isShow
        immediate
      >
        <div className="test">test</div>
      </TransitionProvider>,
      `<div class="opacity-0 test">test</div>`,
    ],
    [
      <TransitionProvider leaveFrom="opacity-0" isShow={false}>
        <div>test</div>
      </TransitionProvider>,
      ``,
    ],
    [
      <TransitionProvider isShow={false} immediate>
        <div className="test">test</div>
      </TransitionProvider>,
      `<div class="test">test</div>`,
    ],
    [
      <TransitionProvider leaveFrom="opacity-0" isShow={false} immediate>
        <div>test</div>
      </TransitionProvider>,
      `<div class="opacity-0">test</div>`,
    ],
    [
      <TransitionProvider leaveFrom="opacity-0" isShow={false} immediate>
        <div className="test">test</div>
      </TransitionProvider>,
      `<div class="opacity-0 test">test</div>`,
    ],
  ];

  table.forEach(([element, result]) =>
    expect(renderToString(element)).toBe(result)
  );
});
