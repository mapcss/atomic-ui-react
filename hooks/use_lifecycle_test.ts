import useLifecycle from "./use_lifecycle.ts";
import { describe, expect, FakeTime, fn, it, setupRaf } from "../dev_deps.ts";
import { renderHook } from "@testing-library/react-hooks";

const describeTests = describe({
  name: "useLifecycle",
  async beforeAll() {
    await setupRaf();
  },
  beforeEach(this: { time: FakeTime }) {
    const time = new FakeTime();
    this.time = time;
  },
  afterEach() {
    this.time.restore();
  },
});

it(describeTests, "should do nothing", () => {
  renderHook(() => useLifecycle({}));
});

it(describeTests, "should call each lifecycle hook", function () {
  const { time } = this;
  const mockFn = fn();
  const { unmount } = renderHook(() =>
    useLifecycle({
      onBeforeMount: () => {
        mockFn("beforeMount");
      },
      onMounted: () => {
        mockFn("mounted");
      },
      onAfterMounted: () => {
        mockFn("afterMounted");
      },
      onBeforeUnMount: () => {
        mockFn("beforeUnmount");
      },
    })
  );
  expect(mockFn).toHaveBeenCalledTimes(2);
  expect(mockFn).toHaveBeenNthCalledWith(1, "beforeMount");
  expect(mockFn).toHaveBeenNthCalledWith(2, "mounted");
  time.next();
  expect(mockFn).toHaveBeenCalledTimes(3);
  expect(mockFn).toHaveBeenNthCalledWith(3, "afterMounted");
  unmount();
  expect(mockFn).toHaveBeenCalledTimes(4);
  expect(mockFn).toHaveBeenNthCalledWith(4, "beforeUnmount");
});

it(
  describeTests,
  "should call each return callback before unmount without beforeMount callback",
  function () {
    const { time } = this;
    const mockFn = fn();
    const { unmount } = renderHook(() =>
      useLifecycle({
        onBeforeMount: () => {
          return () => {
            mockFn("beforeMount");
          };
        },
        onMounted: () => {
          return () => {
            mockFn("mounted");
          };
        },
        onAfterMounted: () => {
          return () => {
            mockFn("afterMounted");
          };
        },
        onBeforeUnMount: () => {
          return () => {
            mockFn("beforeUnmount");
          };
        },
      })
    );
    expect(mockFn).toHaveBeenCalledTimes(0);
    time.next();
    expect(mockFn).toHaveBeenCalledTimes(0);

    unmount();
    expect(mockFn).toHaveBeenCalledTimes(3);
    expect(mockFn).toHaveBeenNthCalledWith(1, "beforeMount");
    expect(mockFn).toHaveBeenNthCalledWith(2, "mounted");
    expect(mockFn).toHaveBeenNthCalledWith(3, "afterMounted");
  },
);

it(
  describeTests,
  "should not call when deps is not updated",
  function () {
    const { time } = this;
    const mockFn = fn();

    const { rerender } = renderHook(() =>
      useLifecycle(
        {
          onBeforeMount: () => {
            mockFn("beforeMount");
          },
          onMounted: () => {
            mockFn("mounted");
          },
          onAfterMounted: () => {
            mockFn("afterMounted");
          },
          onBeforeUnMount: () => {
            mockFn("beforeUnmount");
          },
        },
        [],
      )
    );
    time.next();
    expect(mockFn).toHaveBeenCalledTimes(3);
    rerender();
    expect(mockFn).toHaveBeenCalledTimes(3);
  },
);

it(
  describeTests,
  "should call when deps is updated",
  function () {
    const { time } = this;
    const mockFn = fn();

    const { rerender } = renderHook(({ dep }) =>
      useLifecycle(
        {
          onBeforeMount: () => {
            mockFn("beforeMount");
          },
          onMounted: () => {
            mockFn("mounted");
          },
          onAfterMounted: () => {
            mockFn("afterMounted");
          },
          onBeforeUnMount: () => {
            mockFn("beforeUnmount");
          },
        },
        [dep],
      ), {
      initialProps: {
        dep: false,
      },
    });
    time.next();
    expect(mockFn).toHaveBeenCalledTimes(3);
    rerender({ dep: true });
    expect(mockFn).toHaveBeenCalledTimes(6);
  },
);
