import { renderHook } from "@testing-library/react-hooks";
import useTransition, { cleanRecordToken } from "./use_transition.ts";
import { resolveDurationLike } from "./use_transition_contexts.ts";
import {
  describe,
  expect,
  FakeTime,
  it,
  mockGetComputedStyle,
  ParamReturn,
  setupJSDOM,
  setupRaf,
} from "../dev_deps.ts";

Deno.test("resolveDurationLike", () => {
  expect(resolveDurationLike(100)).toBe(100);
  expect(resolveDurationLike(Infinity)).toBe(0);
  expect(resolveDurationLike(0)).toBe(0);
});

it("cleanRecordToken: should return undefined or non-duplicated token and space", () => {
  const table: ParamReturn<typeof cleanRecordToken>[] = [
    [{}, {}],
    [{ enter: "" }, { enter: undefined }],
    [{ enter: "test" }, { enter: "test" }],
    [{ a: "     " }, { a: undefined }],
    [{ a: "test", b: "test" }, { a: "test", b: "test" }],
    [{ a: " test ", b: " te st " }, { a: "test", b: "te st" }],
    [{ a: "a b a b ab ac ", b: "     ", c: "ac ab a b" }, {
      a: "a b ab ac",
      b: undefined,
      c: "ac ab a b",
    }],
  ];

  table.forEach(([record, result]) =>
    expect(cleanRecordToken(record)).toEqual(result)
  );
});

const describeTests = describe({
  name: "useTransition",
  async beforeAll() {
    await setupJSDOM();
  },
  beforeEach(this: { time: FakeTime; target: HTMLElement }) {
    setupRaf();
    this.time = new FakeTime();
    this.target = document.createElement("div");
  },
  afterEach() {
    this.time.restore();
  },
});

it(
  describeTests,
  "should return each transition lifecycle className",
  function () {
    const { time, target } = this;
    target.style.transitionDuration = "0.3s";
    const reset = mockGetComputedStyle(() => target.style);
    const { result, rerender } = renderHook(({ isEnter }) =>
      useTransition(
        {
          duration: target,
          isEnter,
          immediate: true,
        },
        {
          enter: "enter",
          enterFrom: "enterFrom",
          enterTo: "enterTo  dirty class  name  name",
          entered: "entered",
          leave: "leave",
          leaveFrom: "leaveFrom",
          leaveTo: "leaveTo",
          leaved: "leaved",
        },
      ), {
      initialProps: {
        isEnter: true,
      },
    });
    try {
      expect(result.current[0].className).toBe("enterFrom");
      expect(result.current[1].status).toBe("init");
      expect(result.current[1].classNames).toEqual(["enterFrom"]);
      expect(result.current[1].currentTransitions).toEqual(["enterFrom"]);
      expect(result.current[1].isCompleted).toBeFalsy();
      expect(result.current[1].mode).toBe("enter");
      expect(result.current[1].cleanTransitions).toEqual({
        enter: "enter",
        enterFrom: "enterFrom",
        enterTo: "enterTo dirty class name",
        entered: "entered",
        leave: "leave",
        leaveFrom: "leaveFrom",
        leaveTo: "leaveTo",
        leaved: "leaved",
      });

      time.next();
      expect(result.current[0].className).toBe("enterFrom enter");
      expect(result.current[1].status).toBe("start");
      expect(result.current[1].classNames).toEqual(["enterFrom", "enter"]);
      expect(result.current[1].currentTransitions).toEqual([
        "enterFrom",
        "enter",
      ]);
      expect(result.current[1].isCompleted).toBeFalsy();

      time.next();
      expect(result.current[0].className).toBe(
        "enter enterTo dirty class name",
      );
      expect(result.current[1].status).toBe("wait");
      expect(result.current[1].classNames).toEqual([
        "enter",
        "enterTo",
        "dirty",
        "class",
        "name",
      ]);
      expect(result.current[1].currentTransitions).toEqual([
        "enter",
        "enterTo",
      ]);
      expect(result.current[1].isCompleted).toBeFalsy();

      time.next();
      expect(result.current[0].className).toBe("entered");
      expect(result.current[1].status).toBe("end");
      expect(result.current[1].classNames).toEqual(["entered"]);
      expect(result.current[1].currentTransitions).toEqual(["entered"]);
      expect(result.current[1].isCompleted).toBeTruthy();
      expect(result.current[1].mode).toBe("enter");

      rerender({ isEnter: false });
      expect(result.current[0].className).toBe("leaveFrom");
      expect(result.current[1].status).toBe("init");
      expect(result.current[1].classNames).toEqual(["leaveFrom"]);
      expect(result.current[1].currentTransitions).toEqual(["leaveFrom"]);
      expect(result.current[1].isCompleted).toBeFalsy();
      expect(result.current[1].mode).toBe("leave");

      time.next();
      expect(result.current[0].className).toBe("leaveFrom leave");
      expect(result.current[1].status).toBe("start");
      expect(result.current[1].classNames).toEqual(["leaveFrom", "leave"]);
      expect(result.current[1].currentTransitions).toEqual([
        "leaveFrom",
        "leave",
      ]);
      expect(result.current[1].isCompleted).toBeFalsy();

      time.next();
      expect(result.current[0].className).toBe("leave leaveTo");
      expect(result.current[1].status).toBe("wait");
      expect(result.current[1].classNames).toEqual(["leave", "leaveTo"]);
      expect(result.current[1].currentTransitions).toEqual([
        "leave",
        "leaveTo",
      ]);
      expect(result.current[1].isCompleted).toBeFalsy();
      expect(result.current[1].isShowable).toBeTruthy();

      time.next();
      expect(result.current[0].className).toBe("leaved");
      expect(result.current[1].status).toBe("end");
      expect(result.current[1].classNames).toEqual(["leaved"]);
      expect(result.current[1].currentTransitions).toEqual(["leaved"]);
      expect(result.current[1].isCompleted).toBeTruthy();
      expect(result.current[1].isActivated).toBeTruthy();
      expect(result.current[1].isShowable).toBeFalsy();
    } catch (e) {
      throw e;
    } finally {
      reset();
    }
  },
);

it(
  describeTests,
  "should watching when immediate is false",
  function () {
    const { time, target } = this;
    target.style.transitionDuration = "0.3s";
    const reset = mockGetComputedStyle(() => target.style);
    const { result, rerender } = renderHook(
      ({ isEnter, immediate }) =>
        useTransition(
          {
            duration: target,
            isEnter,
            immediate,
          },
          {
            enter: "enter",
            enterFrom: "enterFrom",
            enterTo: "enterTo",
            entered: "entered",
            leave: "leave",
            leaveFrom: "leaveFrom",
            leaveTo: "leaveTo",
            leaved: "leaved",
          },
        ),
      {
        initialProps: {
          isEnter: true,
          immediate: false,
        },
      },
    );
    try {
      expect(result.current[0].className).toBeUndefined();
      expect(result.current[1].status).toBe("inactive");
      expect(result.current[1].classNames).toEqual([]);
      expect(result.current[1].currentTransitions).toEqual([]);
      expect(result.current[1].isCompleted).toBeFalsy();
      expect(result.current[1].isActivated).toBeFalsy();
      expect(result.current[1].lifecycle).not.toBeDefined();
      expect(result.current[1].mode).toBe(undefined);

      time.next();
      expect(result.current[0].className).toBeUndefined();
      expect(result.current[1].status).toBe("inactive");
      expect(result.current[1].classNames).toEqual([]);
      expect(result.current[1].currentTransitions).toEqual([]);
      expect(result.current[1].isCompleted).toBeFalsy();
      expect(result.current[1].isActivated).toBeFalsy();
      expect(result.current[1].mode).toBe(undefined);

      rerender();
      expect(result.current[1].status).toBe("inactive");
      expect(result.current[1].mode).toBe(undefined);

      rerender({ isEnter: false, immediate: false });
      expect(result.current[1].status).toBe("init");
      expect(result.current[1].mode).toBe("leave");
    } catch (e) {
      throw e;
    } finally {
      reset();
    }
  },
);

it(
  describeTests,
  "should not enabled until deps of immediate is updated",
  function () {
    const { time, target } = this;
    const reset = mockGetComputedStyle(() => target.style);
    const { result, rerender } = renderHook(
      ({ isEnter, immediate }) =>
        useTransition(
          {
            duration: target,
            isEnter,
            immediate,
          },
          {
            enter: "enter",
            enterFrom: "enterFrom",
            enterTo: "enterTo",
            entered: "entered",
            leave: "leave",
            leaveFrom: "leaveFrom",
            leaveTo: "leaveTo",
            leaved: "leaved",
          },
        ),
      {
        initialProps: {
          isEnter: true,
          immediate: false,
        },
      },
    );
    try {
      expect(result.current[1].status).toBe("inactive");

      time.next();
      expect(result.current[1].status).toBe("inactive");

      rerender();
      expect(result.current[1].status).toBe("inactive");

      rerender({ isEnter: false, immediate: true });
      expect(result.current[1].status).toBe("init");
    } catch (e) {
      throw e;
    } finally {
      reset();
    }
  },
);

it(
  describeTests,
  "should not enabled until deps of transition props are updated",
  function () {
    const { time, target } = this;
    const reset = mockGetComputedStyle(() => target.style);
    const { result, rerender } = renderHook(
      ({ enter, isEnter }) =>
        useTransition(
          {
            duration: target,
            isEnter,
          },
          {
            enter,
            enterFrom: "enterFrom",
            enterTo: "enterTo",
            entered: "entered",
            leave: "leave",
            leaveFrom: "leaveFrom",
            leaveTo: "leaveTo",
            leaved: "leaved",
          },
        ),
      {
        initialProps: {
          enter: "",
          isEnter: true,
        },
      },
    );
    try {
      expect(result.current[1].status).toBe("inactive");

      time.next();
      expect(result.current[1].status).toBe("inactive");

      rerender();
      expect(result.current[1].status).toBe("inactive");

      rerender({ enter: "enter", isEnter: true });
      expect(result.current[1].status).toBe("inactive");

      rerender({ enter: "enter", isEnter: false });
      expect(result.current[1].status).toBe("init");
    } catch (e) {
      throw e;
    } finally {
      reset();
    }
  },
);

it(
  describeTests,
  "should skip waiting if duration is none",
  function () {
    const { time, target } = this;
    const { result } = renderHook(() =>
      useTransition(
        {
          duration: target,
          isEnter: true,
          immediate: true,
        },
        {},
      )
    );

    expect(result.current[1].status).toBe("init");
    expect(result.current[1].isCompleted).toBeFalsy();

    time.next();
    expect(result.current[1].status).toBe("start");
    expect(result.current[1].isCompleted).toBeFalsy();

    time.next();
    expect(result.current[1].status).toBe("end");
    expect(result.current[1].isCompleted).toBeTruthy();

    time.runAll();
    expect(result.current[1].status).toBe("end");
    expect(result.current[1].isCompleted).toBeTruthy();
  },
);
