import { renderToString } from "react-dom/server";
import { render } from "@testing-library/react";
import TransitionProvider from "./transition_provider.ts";
import {
  assertSnapshot,
  clsx,
  describe,
  expect,
  FakeTime,
  it,
  mockGetComputedStyle,
  ParamReturn,
  setupJSDOM,
  setupRaf,
} from "../dev_deps.ts";

Deno.test("render as SSR", () => {
  const table: ParamReturn<typeof renderToString>[] = [
    [
      <TransitionProvider
        duration={300}
        enter="transition"
        enterFrom="opacity-0"
        isShow
      >
        {({ className }) => <div className={className}>test</div>}
      </TransitionProvider>,
      `<div>test</div>`,
    ],
    [
      <TransitionProvider
        duration={300}
        enter="transition"
        enterFrom="opacity-0"
        isShow
      >
        {({ className }) => <div className={clsx(className, "test")}>test</div>}
      </TransitionProvider>,
      `<div class="test">test</div>`,
    ],
    [
      <TransitionProvider
        duration={300}
        enter="transition"
        enterFrom="opacity-0"
        isShow
        immediate
      >
        {({ className }) => <div className={className}>test</div>}
      </TransitionProvider>,
      `<div class="opacity-0">test</div>`,
    ],
    [
      <TransitionProvider
        duration={300}
        leave="transition"
        leaveFrom="opacity-100"
        isShow={false}
      >
        {({ className }) => (
          <>
            <div className={className}>test</div>
          </>
        )}
      </TransitionProvider>,
      `<div>test</div>`,
    ],
    [
      <TransitionProvider
        duration={300}
        leave="transition"
        leaveFrom="opacity-100"
        isShow={false}
        immediate
      >
        {({ className }) => (
          <>
            <div className={className}>test</div>
          </>
        )}
      </TransitionProvider>,
      `<div class="opacity-100">test</div>`,
    ],
  ];

  table.forEach(([element, result]) =>
    expect(renderToString(element)).toBe(result)
  );
});

const describeTests = describe({
  name: "TransitionProvider",
  async beforeEach(this: { time: FakeTime; el: HTMLElement; raf: () => void }) {
    await setupJSDOM();

    this.time = new FakeTime();
    this.el = globalThis.document.createElement("div");
    this.raf = setupRaf();
  },
  afterEach() {
    this.raf();
    this.time.restore();
  },
});

it(
  describeTests,
  "should be match snapshot",
  async function (t) {
    const { time, el } = this;
    const reset = mockGetComputedStyle(() => el.style);
    const transitionProps = {
      enterFrom: "opacity-0",
      enter: "  transition ",
      enterTo: "opacity-100  ",
      entered: " text-red-500 text-red-500",
      leaveFrom: " opacity-80 ",
      leave: " transition duration",
      leaveTo: "opacity-30",
      leaved: "hidden",
    };
    const { container, rerender } = render(
      <TransitionProvider
        isShow
        immediate
        duration={300}
        {...transitionProps}
      >
        {({ className }) => <div className={className}>test</div>}
      </TransitionProvider>,
    );

    await assertSnapshot(t, container.innerHTML);
    time.next();
    await assertSnapshot(t, container.innerHTML);
    time.next();
    await assertSnapshot(t, container.innerHTML);
    time.next();
    await assertSnapshot(t, container.innerHTML);
    time.runAll();
    await assertSnapshot(t, container.innerHTML);
    rerender(
      <TransitionProvider
        isShow={false}
        immediate
        duration={500}
        {...transitionProps}
      >
        {({ className }) => <div className={className}>test</div>}
      </TransitionProvider>,
    );
    await assertSnapshot(t, container.innerHTML);
    time.next();
    await assertSnapshot(t, container.innerHTML);
    time.next();
    await assertSnapshot(t, container.innerHTML);
    time.next();
    await assertSnapshot(t, container.innerHTML);
    time.runAll();
    await assertSnapshot(t, container.innerHTML);
    reset();
  },
);
