import useBoolean from "./use_boolean.ts";
import { expect } from "../dev_deps.ts";
import { act, renderHook } from "@testing-library/react-hooks";

Deno.test("should toggle state", () => {
  const { result } = renderHook(() => useBoolean());

  expect(result.current[0]).toBe(false);

  act(() => {
    result.current[1].on();
  });
  expect(result.current[0]).toBe(true);
  act(() => {
    result.current[1].on();
  });
  expect(result.current[0]).toBe(true);
  act(() => {
    result.current[1].off();
  });
  expect(result.current[0]).toBe(false);
  act(() => {
    result.current[1].off();
  });
  expect(result.current[0]).toBe(false);
  act(() => {
    result.current[1].toggle();
  });
  expect(result.current[0]).toBe(true);
  act(() => {
    result.current[1].toggle();
  });
  expect(result.current[0]).toBe(false);
});
