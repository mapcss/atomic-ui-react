import { renderToString } from "react-dom/server";
import { render } from "@testing-library/react";
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
import { mergeProps } from "../util.ts";

Deno.test("render as SSR", () => {
  const table: ParamReturn<typeof renderToString>[] = [
    [
      <WithTransition enter="transition" enterFrom="opacity-0" isShow>
        {(attrs) => <div {...attrs}>test</div>}
      </WithTransition>,
      `<div>test</div>`,
    ],
    [
      <WithTransition enter="transition" enterFrom="opacity-0" isShow>
        {(attrs) => <div {...attrs} className="test">test</div>}
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
        {(attrs) => <div {...attrs}>test</div>}
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
        {(attrs) => (
          <div {...mergeProps({ className: "test" }, attrs)}>test</div>
        )}
      </WithTransition>,
      `<div class="test opacity-0">test</div>`,
    ],
    [
      <WithTransition leaveFrom="opacity-0" isShow={false}>
        {(_, { isShowable }) => isShowable ? <div>test</div> : <></>}
      </WithTransition>,
      ``,
    ],
    [
      <WithTransition isShow={false} immediate>
        {(attrs) => (
          <div {...mergeProps({ className: "test" }, attrs)}>test</div>
        )}
      </WithTransition>,
      `<div class="test">test</div>`,
    ],
    [
      <WithTransition leaveFrom="opacity-0" isShow={false} immediate>
        {(attrs) => <div {...attrs}>test</div>}
      </WithTransition>,
      `<div class="opacity-0">test</div>`,
    ],
    [
      <WithTransition leaveFrom="opacity-0" isShow={false} immediate>
        {(attrs) => (
          <div {...mergeProps({ className: "test" }, attrs)}>test</div>
        )}
      </WithTransition>,
      `<div class="test opacity-0">test</div>`,
    ],
    [
      <WithTransition enterFrom="opacity-0" isShow>
        {(attrs) => <div {...attrs}>test</div>}
      </WithTransition>,
      `<div>test</div>`,
    ],
    [
      <WithTransition enterFrom="opacity-0" isShow immediate>
        {(attrs) => <div {...attrs}>test</div>}
      </WithTransition>,
      `<div class="opacity-0">test</div>`,
    ],
    [
      <WithTransition leaveFrom="opacity-80" isShow={false}>
        {(attrs) => <div {...attrs}>test</div>}
      </WithTransition>,
      `<div>test</div>`,
    ],
    [
      <WithTransition leaveFrom="opacity-80" isShow={false} immediate>
        {(attrs) => <div {...attrs}>test</div>}
      </WithTransition>,
      `<div class="opacity-80">test</div>`,
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
        {(attrs) => (
          <div
            {...mergeProps({ "data-testid": "test", className: "test" }, attrs)}
          >
            test
          </div>
        )}
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
        {(attrs) => (
          <div {...mergeProps({ className: "test" }, attrs)}>test</div>
        )}
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
        {(attrs) => (
          <div {...mergeProps({ className: "test" }, attrs)}>test</div>
        )}
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
    const { container } = render(
      <WithTransition
        isShow={false}
        immediate
        {...transitionProps}
      >
        {(attrs) => (
          <div {...mergeProps({ className: "test" }, attrs)}>test</div>
        )}
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

// it(
//   describeTests,
//   "should render DOM as Props",
//   async function (t) {
//     const { time, el } = this;
//     el.style.transitionDuration = "3s";
//     const reset = mockGetComputedStyle(() => el.style);
//     const transitionProps = {
//       enterFrom: "opacity-0",
//       enter: "  transition ",
//       enterTo: "opacity-100  ",
//       entered: " text-red-500 text-red-500",
//       leaveFrom: " opacity-80 ",
//       leave: " transition duration",
//       leaveTo: "opacity-30",
//       leaved: "hidden",
//     };

//     const Child = forwardRef<HTMLDivElement>((_, ref) => {
//       return <div className=" test " ref={ref}>children</div>;
//     });
//     const { container, rerender } = render(
//       <WithTransition
//         isShow
//         immediate
//         {...transitionProps}
//       >
//         <Child />
//       </WithTransition>,
//     );

//     await assertSnapshot(t, container.innerHTML);
//     time.next();
//     await assertSnapshot(t, container.innerHTML);
//     time.next();
//     await assertSnapshot(t, container.innerHTML);
//     time.next();
//     await assertSnapshot(t, container.innerHTML);
//     time.runAll();
//     await assertSnapshot(t, container.innerHTML);

//     rerender(
//       <WithTransition
//         isShow={false}
//         immediate
//         {...transitionProps}
//       >
//         <Child />
//       </WithTransition>,
//     );
//     await assertSnapshot(t, container.innerHTML);
//     time.next();
//     await assertSnapshot(t, container.innerHTML);
//     time.next();
//     await assertSnapshot(t, container.innerHTML);
//     time.next();
//     await assertSnapshot(t, container.innerHTML);
//     time.runAll();
//     await assertSnapshot(t, container.innerHTML);

//     reset();
//   },
// );
