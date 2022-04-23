import useTimeout from "./use_timeout.ts";
import { expect, FakeTime, fn } from "../dev_deps.ts";
import { act, renderHook } from "@testing-library/react-hooks";

Deno.test("useTimeout: should not call on use is false", () => {
  const mock = fn();
  renderHook(() => useTimeout(mock, { use: false }));
  expect(mock).not.toHaveBeenCalled();
});

Deno.test("useTimeout: should call on use is true or default", () => {
  const time = new FakeTime();

  const mock = fn();
  renderHook(() => useTimeout(mock));
  expect(mock).not.toHaveBeenCalled();
  time.runAll();

  expect(mock).toHaveBeenCalled();
  time.restore();
});

Deno.test("useTimeout: should call with delay", () => {
  const time = new FakeTime();

  const mock = fn();
  renderHook(() => useTimeout(mock, { ms: 1000 }));
  expect(mock).not.toHaveBeenCalled();
  time.tick(999);
  expect(mock).not.toHaveBeenCalled();
  time.tick(1000);

  expect(mock).toHaveBeenCalled();
  time.restore();
});

Deno.test("useTimeout: should call once if the deps are not updated", () => {
  const time = new FakeTime();

  const mock = fn();
  const { rerender } = renderHook(() => useTimeout(mock));
  expect(mock).not.toHaveBeenCalled();
  time.tick(0);
  expect(mock).toHaveBeenCalledTimes(1);
  rerender();
  time.runAll();
  expect(mock).toHaveBeenCalledTimes(1);
  time.restore();
});

Deno.test("useTimeout: should call callback before unmount", () => {
  const time = new FakeTime();

  const mock = fn();
  const { unmount } = renderHook(() => useTimeout(() => mock));

  time.runAll();
  expect(mock).not.toHaveBeenCalled();
  unmount();
  expect(mock).toHaveBeenCalledTimes(1);

  time.restore();
});

Deno.test("useTimeout: should call with arguments", () => {
  const time = new FakeTime();
  const mock = fn();

  renderHook(() => useTimeout(mock, { args: [10] }));

  time.runAll();
  expect(mock).toHaveBeenCalledWith([10]);

  time.restore();
});
