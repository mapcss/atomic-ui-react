import { renderToString } from "react-dom/server";
import { render } from "@testing-library/react";
import { forwardRef } from "react";
import WithTransition from "./with_transition.ts";
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
      <WithTransition enter="transition" enterFrom="opacity-0" isShow>
        <div>test</div>
      </WithTransition>,
      `<div>test</div>`,
    ],
    [
      <WithTransition enter="transition" enterFrom="opacity-0" isShow>
        <div className="test">test</div>
      </WithTransition>,
      `<div class="test">test</div>`,
    ],
    [
      <WithTransition
        enter="transition"
        enterFrom="opacity-0"
        isShow
        immediate
      >
        <div>test</div>
      </WithTransition>,
      `<div class="opacity-0">test</div>`,
    ],
    [
      <WithTransition
        enter="transition"
        enterFrom="opacity-0"
        isShow
        immediate
      >
        <div className="test">test</div>
      </WithTransition>,
      `<div class="test opacity-0">test</div>`,
    ],
    [
      <WithTransition leaveFrom="opacity-0" isShow={false}>
        <div>test</div>
      </WithTransition>,
      ``,
    ],
    [
      <WithTransition isShow={false} immediate>
        <div className="test">test</div>
      </WithTransition>,
      `<div class="test">test</div>`,
    ],
    [
      <WithTransition leaveFrom="opacity-0" isShow={false} immediate>
        <div>test</div>
      </WithTransition>,
      `<div class="opacity-0">test</div>`,
    ],
    [
      <WithTransition leaveFrom="opacity-0" isShow={false} immediate>
        <div className="test">test</div>
      </WithTransition>,
      `<div class="test opacity-0">test</div>`,
    ],
    [
      <WithTransition isShow>
        <Child />
      </WithTransition>,
      `<div>test</div>`,
    ],
    [
      <WithTransition isShow>
        <Child className="test" />
      </WithTransition>,
      `<div class="test">test</div>`,
    ],
    [
      <WithTransition enterFrom="opacity-0" isShow immediate>
        <Child />
      </WithTransition>,
      `<div class="opacity-0">test</div>`,
    ],
  ];

  table.forEach(([element, result]) =>
    expect(renderToString(element)).toBe(result)
  );
});

const describeTests = describe({
  name: "WithTransition",
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
      <WithTransition isShow enterFrom="opacity-0">
        <div data-testid="test" className="test">test</div>
      </WithTransition>,
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
    };
    const { container, rerender } = render(
      <WithTransition
        isShow
        immediate
        {...transitionProps}
      >
        <div className="test">test</div>
      </WithTransition>,
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
      <WithTransition
        isShow={false}
        immediate
        {...transitionProps}
      >
        <div className="test">test</div>
      </WithTransition>,
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
  "should keep DOM when leaved transition map is exists",
  async function (t) {
    const { time, el } = this;
    el.style.transitionDuration = "3s";
    const reset = mockGetComputedStyle(() => el.style);
    const transitionProps = {
      leaveFrom: " opacity-80 ",
      leave: " transition duration",
      leaveTo: "opacity-30",
      leaved: "opacity-0",
    };
    const { container, rerender } = render(
      <WithTransition
        isShow={false}
        immediate
        {...transitionProps}
      >
        <div className="test">test</div>
      </WithTransition>,
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
      <WithTransition
        isShow
        immediate
        {...transitionProps}
      >
        <Child />
      </WithTransition>,
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
      <WithTransition
        isShow={false}
        immediate
        {...transitionProps}
      >
        <Child />
      </WithTransition>,
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
