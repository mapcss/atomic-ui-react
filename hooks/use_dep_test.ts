import useDep from "./use_dep.ts";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "../dev_deps.ts";
import { equal } from "../util.ts";

Deno.test("useDep should return toggled boolean value if the value is mutated", () => {
  const { rerender, result } = renderHook(({ value }) => useDep(value, equal), {
    initialProps: {
      value: {} as unknown,
    },
  });

  expect(result.current).toBeFalsy();

  rerender();
  expect(result.current).toBeFalsy();

  rerender({ value: {} });
  expect(result.current).toBeFalsy();

  rerender({ value: { a: "b" } });
  expect(result.current).toBeTruthy();

  rerender({ value: { a: "b" } });
  expect(result.current).toBeTruthy();

  rerender({ value: { a: "b", b: { c: {} } } });
  expect(result.current).toBeFalsy();
});
