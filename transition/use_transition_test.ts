import { renderHook } from "@testing-library/react-hooks";
import useTransition, {
  cleanRecordToken,
  resolveDurationLike,
} from "./use_transition.ts";
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
    const { result, rerender } = renderHook(({ isShow }) =>
      useTransition(
        {
          duration: target,
          isShow,
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
        [isShow],
      ), {
      initialProps: {
        isShow: true,
      },
    });
    try {
      expect(result.current.status).toBe("init");
      expect(result.current.className).toBe("enterFrom");
      expect(result.current.classNames).toEqual(["enterFrom"]);
      expect(result.current.currentTransitions).toEqual(["enterFrom"]);
      expect(result.current.isCompleted).toBeFalsy();
      expect(result.current.isFirst).toBeTruthy();
      expect(result.current.mode).toBe("enter");
      expect(result.current.cleanTransitionMap).toEqual({
        enter: "enter",
        enterFrom: "enterFrom",
        enterTo: "enterTo dirty class name",
        entered: "entered",
        leave: "leave",
        leaveFrom: "leaveFrom",
        leaveTo: "leaveTo",
        leaved: "leaved",
      });
      expect(result.current.hasLeaved).toBeTruthy();

      time.next();
      expect(result.current.status).toBe("start");
      expect(result.current.className).toBe("enterFrom enter");
      expect(result.current.classNames).toEqual(["enterFrom", "enter"]);
      expect(result.current.currentTransitions).toEqual(["enterFrom", "enter"]);
      expect(result.current.isCompleted).toBeFalsy();
      expect(result.current.isFirst).toBeFalsy();

      time.next();
      expect(result.current.status).toBe("wait");
      expect(result.current.className).toBe("enter enterTo dirty class name");
      expect(result.current.classNames).toEqual([
        "enter",
        "enterTo",
        "dirty",
        "class",
        "name",
      ]);
      expect(result.current.currentTransitions).toEqual(["enter", "enterTo"]);
      expect(result.current.isCompleted).toBeFalsy();

      time.next();
      expect(result.current.status).toBe("end");
      expect(result.current.className).toBe("entered");
      expect(result.current.classNames).toEqual(["entered"]);
      expect(result.current.currentTransitions).toEqual(["entered"]);
      expect(result.current.isCompleted).toBeTruthy();
      expect(result.current.mode).toBe("enter");

      rerender({ isShow: false });
      expect(result.current.status).toBe("init");
      expect(result.current.className).toBe("leaveFrom");
      expect(result.current.classNames).toEqual(["leaveFrom"]);
      expect(result.current.currentTransitions).toEqual(["leaveFrom"]);
      expect(result.current.isCompleted).toBeFalsy();
      expect(result.current.mode).toBe("leave");

      time.next();
      expect(result.current.status).toBe("start");
      expect(result.current.className).toBe("leaveFrom leave");
      expect(result.current.classNames).toEqual(["leaveFrom", "leave"]);
      expect(result.current.currentTransitions).toEqual(["leaveFrom", "leave"]);
      expect(result.current.isCompleted).toBeFalsy();

      time.next();
      expect(result.current.status).toBe("wait");
      expect(result.current.className).toBe("leave leaveTo");
      expect(result.current.classNames).toEqual(["leave", "leaveTo"]);
      expect(result.current.currentTransitions).toEqual(["leave", "leaveTo"]);
      expect(result.current.isCompleted).toBeFalsy();
      expect(result.current.isShowable).toBeTruthy();

      time.next();
      expect(result.current.status).toBe("end");
      expect(result.current.className).toBe("leaved");
      expect(result.current.classNames).toEqual(["leaved"]);
      expect(result.current.currentTransitions).toEqual(["leaved"]);
      expect(result.current.isCompleted).toBeTruthy();
      expect(result.current.isShowable).toBeTruthy();
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
      ({ isShow, immediate }) =>
        useTransition(
          {
            duration: target,
            isShow,
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
          [],
        ),
      {
        initialProps: {
          isShow: true,
          immediate: false,
        },
      },
    );
    try {
      expect(result.current.status).toBe("inactive");
      expect(result.current.className).toBeUndefined();
      expect(result.current.classNames).toEqual([]);
      expect(result.current.currentTransitions).toEqual([]);
      expect(result.current.isCompleted).toBeFalsy();
      expect(result.current.isActivated).toBeFalsy();
      expect(result.current.lifecycle).not.toBeDefined();
      expect(result.current.mode).toBe(undefined);

      time.next();
      expect(result.current.status).toBe("inactive");
      expect(result.current.className).toBeUndefined();
      expect(result.current.classNames).toEqual([]);
      expect(result.current.currentTransitions).toEqual([]);
      expect(result.current.isCompleted).toBeFalsy();
      expect(result.current.isActivated).toBeFalsy();
      expect(result.current.mode).toBe(undefined);

      rerender();
      expect(result.current.status).toBe("inactive");
      expect(result.current.mode).toBe(undefined);

      rerender({ isShow: false, immediate: false });
      expect(result.current.status).toBe("init");
      expect(result.current.mode).toBe("leave");
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
      ({ isShow, immediate }) =>
        useTransition(
          {
            duration: target,
            isShow,
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
          [],
        ),
      {
        initialProps: {
          isShow: true,
          immediate: false,
        },
      },
    );
    try {
      expect(result.current.status).toBe("inactive");

      time.next();
      expect(result.current.status).toBe("inactive");

      rerender();
      expect(result.current.status).toBe("inactive");

      rerender({ isShow: true, immediate: true });
      expect(result.current.status).toBe("init");
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
      ({ enter }) =>
        useTransition(
          {
            duration: target,
            isShow: true,
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
          [],
        ),
      {
        initialProps: {
          enter: "",
        },
      },
    );
    try {
      expect(result.current.status).toBe("inactive");

      time.next();
      expect(result.current.status).toBe("inactive");

      rerender();
      expect(result.current.status).toBe("inactive");

      rerender({ enter: "enter" });
      expect(result.current.status).toBe("init");
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
          isShow: true,
          immediate: true,
        },
        {},
        [],
      )
    );

    expect(result.current.status).toBe("init");
    expect(result.current.isCompleted).toBeFalsy();

    time.next();
    expect(result.current.status).toBe("start");
    expect(result.current.isCompleted).toBeFalsy();

    time.next();
    expect(result.current.status).toBe("end");
    expect(result.current.isCompleted).toBeTruthy();

    time.runAll();
    expect(result.current.status).toBe("end");
    expect(result.current.isCompleted).toBeTruthy();
  },
);
