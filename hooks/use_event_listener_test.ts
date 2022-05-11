import useEventListener from "./use_event_listener.ts";
import { renderHook } from "@testing-library/react-hooks";
import { fireEvent } from "@testing-library/react";

import { describe, expect, fn, it, setupJSDOM } from "../dev_deps.ts";

const describeTests = describe({
  name: "useEventListener",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should add event listener and remove on unmount", () => {
  const mockFn = fn();
  const { unmount } = renderHook(() =>
    useEventListener({
      target: globalThis.window,
      event: "click",
      callback: mockFn,
    })
  );

  const clickEvent = new Event("click");

  expect(mockFn).not.toHaveBeenCalled();
  globalThis.window.dispatchEvent(clickEvent);
  expect(mockFn).toHaveBeenCalled();
  expect(mockFn).toHaveBeenCalledWith(clickEvent);

  globalThis.window.dispatchEvent(clickEvent);
  globalThis.window.dispatchEvent(new Event("mouseenter"));
  expect(mockFn).toHaveBeenCalledTimes(2);

  unmount();

  globalThis.window.dispatchEvent(clickEvent);
  expect(mockFn).toHaveBeenCalledTimes(2);
});

it(describeTests, "should add event listener to lazy element", () => {
  const mockFn = fn();
  const el = document.createElement("div");
  const { unmount } = renderHook(() =>
    useEventListener({
      target: () => el,
      event: "focus",
      callback: mockFn,
    })
  );

  expect(mockFn).not.toHaveBeenCalled();

  fireEvent.focus(el);
  expect(mockFn).toHaveBeenCalled();

  unmount();

  fireEvent.focus(el);
  expect(mockFn).toHaveBeenCalledTimes(1);
});

it(describeTests, "should add event listener to lazy element", () => {
  const mockFn = fn();
  const el = document.createElement("div");
  const { unmount } = renderHook(() =>
    useEventListener({
      target: () => el,
      event: "focus",
      callback: mockFn,
    })
  );

  expect(mockFn).not.toHaveBeenCalled();

  fireEvent.focus(el);
  expect(mockFn).toHaveBeenCalled();

  unmount();

  fireEvent.focus(el);
  expect(mockFn).toHaveBeenCalledTimes(1);
});

it(describeTests, "should add event listener to lazy element", () => {
  const mockFn = fn();
  const el = document.createElement("div");
  const { unmount } = renderHook(() =>
    useEventListener({
      target: () => el,
      event: ["mouseenter", "mouseleave"],
      callback: mockFn,
    })
  );

  expect(mockFn).not.toHaveBeenCalled();

  fireEvent.mouseEnter(el);
  fireEvent.mouseLeave(el);
  expect(mockFn).toHaveBeenCalledTimes(2);

  unmount();
  fireEvent.mouseEnter(el);
  fireEvent.mouseLeave(el);
  expect(mockFn).toHaveBeenCalledTimes(2);
});
