import useRangeCounter, {
  first,
  last,
  next,
  prev,
} from "./use_range_counter.ts";
import { expect } from "../dev_deps.ts";
import { act, renderHook } from "@testing-library/react-hooks";

Deno.test("prev", () => {
  const table: [number, number, number][] = [
    [0, 0, 0],
    [0, 1, 1],
    [0, 2, 2],
    [1, 0, 0],
    [1, 1, 0],
    [1, 2, 0],
    [2, 0, 0],
    [2, 1, 1],
    [2, 2, 1],
  ];
  table.forEach(([current, max, result]) =>
    expect(prev({ current, max })).toBe(result)
  );
});

Deno.test("next", () => {
  const table: [number, number, number][] = [
    [0, 0, 0],
    [0, 1, 1],
    [0, 2, 1],
    [1, 0, 0],
    [1, 1, 0],
    [1, 2, 2],
    [2, 0, 0],
    [2, 1, 0],
    [2, 2, 0],
  ];
  table.forEach(([current, max, result]) =>
    expect(next({ current, max })).toBe(result)
  );
});

Deno.test("first", () => {
  const table: [number, number, number][] = [
    [0, 0, 0],
    [0, 1, 0],
    [0, 2, 0],
    [1, 0, 0],
    [1, 1, 0],
    [1, 2, 0],
    [2, 0, 0],
    [2, 1, 0],
    [2, 2, 0],
  ];
  table.forEach(([current, max, result]) =>
    expect(first({ current, max })).toBe(result)
  );
});

Deno.test("last", () => {
  const table: [number, number, number][] = [
    [0, 0, 0],
    [0, 1, 1],
    [0, 2, 2],
    [1, 0, 0],
    [1, 1, 1],
    [1, 2, 2],
    [2, 0, 0],
    [2, 1, 1],
    [2, 2, 2],
  ];
  table.forEach(([current, max, result]) =>
    expect(last({ current, max })).toBe(result)
  );
});

Deno.test("useRangeCounter should return cycle counter value", () => {
  const { result } = renderHook(() => useRangeCounter(5, 0));

  expect(result.current[0]).toBe(0);

  act(() => result.current[1]({ type: "prev" }));
  expect(result.current[0]).toBe(5);

  act(() => result.current[1]({ type: "next" }));
  expect(result.current[0]).toBe(0);

  act(() => result.current[1]({ type: "last" }));
  expect(result.current[0]).toBe(5);

  act(() => result.current[1]({ type: "first" }));
  expect(result.current[0]).toBe(0);
});

Deno.test("useRangeCounter should return 0 when initial state is undefined and called next", () => {
  const { result } = renderHook(() => useRangeCounter(5));

  expect(result.current[0]).toBeUndefined();

  act(() => result.current[1]({ type: "next" }));
  expect(result.current[0]).toBe(0);
});

Deno.test("useRangeCounter should return 0 when initial state is undefined and called first", () => {
  const { result } = renderHook(() => useRangeCounter(5));

  expect(result.current[0]).toBeUndefined();

  act(() => result.current[1]({ type: "first" }));
  expect(result.current[0]).toBe(0);
});

Deno.test("useRangeCounter should return last number when initial state is undefined and called prev", () => {
  const { result } = renderHook(() => useRangeCounter(5));

  expect(result.current[0]).toBeUndefined();

  act(() => result.current[1]({ type: "prev" }));
  expect(result.current[0]).toBe(5);
});

Deno.test("useRangeCounter should return last number when initial state is undefined and called last", () => {
  const { result } = renderHook(() => useRangeCounter(5));

  expect(result.current[0]).toBeUndefined();

  act(() => result.current[1]({ type: "last" }));
  expect(result.current[0]).toBe(5);
});
