import useTransitionLifecycle from "./use_transition_lifecycle.ts";
import { describe, expect, FakeTime, it, setupRaf } from "../dev_deps.ts";
import { renderHook } from "@testing-library/react-hooks";

const useTransitionStatusTests = describe({
  name: "useTransitionStatus",

  beforeEach(this: { time: FakeTime; raf: () => void }) {
    this.time = new FakeTime();
    const reset = setupRaf();
    this.raf = reset;
  },

  afterEach() {
    this.time.restore();
    this.raf();
  },
});

it(
  useTransitionStatusTests,
  "should return state as lifecycle",
  function () {
    const { time } = this;
    const { result } = renderHook(() =>
      useTransitionLifecycle({ duration: 300 }, [])
    );

    expect(result.current[0]).toBeTruthy();
    expect(result.current[1]).toBe("init");
    time.next();
    expect(result.current[1]).toBe("start");
    time.next();
    expect(result.current[1]).toBe("wait");
    time.tick(299);
    expect(result.current[1]).toBe("wait");
    time.tick(1);
    expect(result.current[1]).toBe("end");
    time.runAll();
    expect(result.current[0]).toBeTruthy();
    expect(result.current[1]).toBe("end");
  },
);

it(
  useTransitionStatusTests,
  "should not rerender when deps are not updated",
  function () {
    const { time } = this;
    const { result, rerender } = renderHook(
      ({ duration }) => useTransitionLifecycle({ duration }, [duration]),
      { initialProps: { duration: 300 } },
    );

    expect(result.current[1]).toBe("init");

    time.runAll();
    expect(result.current[1]).toBe("end");

    rerender({ duration: 300 });
    expect(result.current[1]).toBe("end");
    rerender({ duration: 0 });
    expect(result.current[1]).toBe("init");
  },
);

it(
  useTransitionStatusTests,
  "should be inactive when use is false",
  function () {
    const { time } = this;
    const { result, rerender } = renderHook(
      ({ duration, use }) =>
        useTransitionLifecycle({ duration, use }, [duration, use]),
      { initialProps: { duration: 300, use: false } },
    );

    expect(result.current[0]).toBeFalsy();
    expect(result.current[1]).not.toBeDefined();

    time.runAll();
    expect(result.current[0]).toBeFalsy();

    rerender({ duration: 300, use: true });
    expect(result.current[0]).toBeTruthy();
    expect(result.current[1]).toBe("init");
    time.next();
    expect(result.current[1]).toBe("start");
    rerender({ duration: 300, use: false });
    expect(result.current[0]).toBeFalsy();
    expect(result.current[1]).not.toBeDefined();
    rerender({ duration: 300, use: true });
    expect(result.current[1]).toBe("init");
  },
);
