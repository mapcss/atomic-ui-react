import useTransitionLifecycle from "./use_transition_lifecycle.ts";
import { describe, expect, FakeTime, it, setupRaf } from "../dev_deps.ts";
import { renderHook } from "@testing-library/react-hooks";

const useTransitionLifecycleTests = describe({
  name: "useTransitionLifecycle",
  async beforeEach(this: { time: FakeTime }) {
    await setupRaf();
    this.time = new FakeTime();
  },
  afterEach() {
    this.time.restore();
  },
});

it(
  useTransitionLifecycleTests,
  "should return state as lifecycle",
  function () {
    const { time } = this;
    const { result } = renderHook(() => useTransitionLifecycle(300, []));

    expect(result.current).toBe("init");
    time.next();
    expect(result.current).toBe("start");
    time.next();
    expect(result.current).toBe("wait");
    time.tick(299);
    expect(result.current).toBe("wait");
    time.tick(1);
    expect(result.current).toBe("end");
    time.runAll();
    expect(result.current).toBe("end");
  },
);

it(
  useTransitionLifecycleTests,
  "should not rerender when deps or duration is not updated",
  function () {
    const { time } = this;
    const { result, rerender } = renderHook(
      ({ duration }) => useTransitionLifecycle(duration, []),
      { initialProps: { duration: 300 } },
    );

    expect(result.current).toBe("init");

    time.runAll();
    expect(result.current).toBe("end");

    rerender({ duration: 300 });
    expect(result.current).toBe("end");
    rerender({ duration: 0 });
    expect(result.current).toBe("init");
  },
);
