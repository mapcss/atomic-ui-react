import usePrevious from "./use_previous.ts";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "../dev_deps.ts";

Deno.test("usePrevious should", () => {
  const { rerender, result } = renderHook(({ value }) => usePrevious(value), {
    initialProps: {
      value: false as unknown,
    },
  });

  expect(result.current).toBeUndefined();

  rerender({ value: undefined });
  expect(result.current).toBeFalsy();

  rerender({ value: true });
  expect(result.current).toBeUndefined();

  rerender({ value: undefined });
  expect(result.current).toBeTruthy();
});
