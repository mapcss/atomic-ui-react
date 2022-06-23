import useTimeout from "./use_timeout.ts";
import { expect, FakeTime, fn } from "../dev_deps.ts";
import { renderHook } from "@testing-library/react-hooks";

Deno.test("useTimeout: should call with delay", () => {
  const time = new FakeTime();

  const mock = fn();
  renderHook(() =>
    useTimeout({
      callback: mock,
      ms: 1000,
    })
  );
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
  const { rerender } = renderHook(() =>
    useTimeout({
      callback: mock,
      ms: 0,
    }, [])
  );
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
  const { unmount } = renderHook(() =>
    useTimeout({
      callback: () => mock,
      ms: 0,
    })
  );

  time.runAll();
  expect(mock).not.toHaveBeenCalled();
  unmount();
  expect(mock).toHaveBeenCalledTimes(1);

  time.restore();
});

Deno.test("useTimeout: should call with arguments", () => {
  const time = new FakeTime();
  const mock = fn();

  renderHook(() =>
    useTimeout({
      callback: function () {
        mock(arguments);
      },
      ms: 0,
      args: [10],
    })
  );

  time.runAll();
  expect(mock).toHaveBeenCalledWith({ "0": 10 });

  time.restore();
});
