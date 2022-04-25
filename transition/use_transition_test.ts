import { renderHook } from "@testing-library/react-hooks";
import useTransition, { resolveElement } from "./use_transition.ts";
import {
  describe,
  expect,
  FakeTime,
  it,
  mockGetComputedStyle,
  setupJSDOM,
  setupRaf,
} from "../dev_deps.ts";

const resolveElementTest = describe({
  name: "resolveElement",
  beforeAll: setupJSDOM,
});

it(resolveElementTest, "should return element or undefined/null", () => {
  const el = globalThis.document.createElement("div");
  expect(resolveElement(null)).toBe(null);
  expect(resolveElement(undefined)).toBe(undefined);
  expect(resolveElement(el)).toEqual(el);
  expect(resolveElement(() => el)).toEqual(el);
  expect(resolveElement(() => undefined)).toBe(undefined);
  expect(resolveElement({ current: el })).toEqual(el);
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
          target,
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

      time.next();
      expect(result.current.status).toBe("start");
      expect(result.current.className).toBe("enterFrom enter");
      expect(result.current.classNames).toEqual(["enterFrom", "enter"]);
      expect(result.current.currentTransitions).toEqual(["enterFrom", "enter"]);
      expect(result.current.isCompleted).toBeFalsy();

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

      rerender({ isShow: false });
      expect(result.current.status).toBe("init");
      expect(result.current.className).toBe("leaveFrom");
      expect(result.current.classNames).toEqual(["leaveFrom"]);
      expect(result.current.currentTransitions).toEqual(["leaveFrom"]);
      expect(result.current.isCompleted).toBeFalsy();

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
      expect(result.current.isShowable).toBeFalsy();
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
            target,
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

      time.next();
      expect(result.current.status).toBe("inactive");
      expect(result.current.className).toBeUndefined();
      expect(result.current.classNames).toEqual([]);
      expect(result.current.currentTransitions).toEqual([]);
      expect(result.current.isCompleted).toBeFalsy();
      expect(result.current.isActivated).toBeFalsy();

      rerender();
      expect(result.current.status).toBe("inactive");

      rerender({ isShow: false, immediate: false });
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
  "should not enabled until deps of immediate is updated",
  function () {
    const { time, target } = this;
    const reset = mockGetComputedStyle(() => target.style);
    const { result, rerender } = renderHook(
      ({ isShow, immediate }) =>
        useTransition(
          {
            target,
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
            target,
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
          target,
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
