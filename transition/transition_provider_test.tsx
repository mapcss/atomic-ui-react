import { renderToString } from "react-dom/server";
import { render } from "@testing-library/react";
import { forwardRef } from "react";
import TransitionProvider from "./transition_provider.ts";
import {
  assertSnapshot,
  describe,
  expect,
  FakeTime,
  it,
  mockGetComputedStyle,
  ParamReturn,
  setupJSDOM,
  setupRaf,
} from "../dev_deps.ts";

const Child = forwardRef<HTMLDivElement, { className?: string }>(
  (props, ref) => {
    return <div {...props} ref={ref}>test</div>;
  },
);

Deno.test("render as SSR", () => {
  const table: ParamReturn<typeof renderToString>[] = [
    [
      <TransitionProvider enter="transition" enterTo="opacity-0" isShow>
        <div>test</div>
      </TransitionProvider>,
      `<div>test</div>`,
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
      `<div>test</div>`,
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
      `<div class="test">test</div>`,
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
      `<div>test</div>`,
    ],
    [
      <TransitionProvider leaveFrom="opacity-0" isShow={false} immediate>
        <div className="test">test</div>
      </TransitionProvider>,
      `<div class="test">test</div>`,
    ],
    [
      <TransitionProvider isShow>
        <Child />
      </TransitionProvider>,
      `<div>test</div>`,
    ],
    [
      <TransitionProvider isShow>
        <Child className="test" />
      </TransitionProvider>,
      `<div class="test">test</div>`,
    ],
    [
      <TransitionProvider enterFrom="opacity-0" isShow immediate>
        <Child />
      </TransitionProvider>,
      `<div>test</div>`,
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
  "if isShow is true at first mount, it should render to DOM",
  async function (t) {
    const { getByTestId } = render(
      <TransitionProvider isShow enterFrom="opacity-0">
        <div data-testid="test" className="test">test</div>
      </TransitionProvider>,
    );

    const id = getByTestId("test");
    expect(id).toBeDefined();
    expect(id.className).toBe("test");
    await assertSnapshot(t, id.outerHTML);
  },
);

it(
  describeTests,
  "should be match snapshot",
  async function (t) {
    const { time, el } = this;
    el.style.transitionDuration = "3s";
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
        {...transitionProps}
      >
        <div className="test">test</div>
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
        {...transitionProps}
      >
        <div className="test">test</div>
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

it(
  describeTests,
  "should add transition props to forwardable child component",
  async function (t) {
    const { time, el } = this;
    el.style.transitionDuration = "3s";
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

    const Child = forwardRef<HTMLDivElement>((_, ref) => {
      return <div className=" test " ref={ref}>children</div>;
    });
    const { container, rerender } = render(
      <TransitionProvider
        isShow
        immediate
        {...transitionProps}
      >
        <Child />
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
        {...transitionProps}
      >
        <Child />
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
