import useId from "./use_id.ts";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "../dev_deps.ts";
import SSRProvider from "../ssr/ssr_provider.ts";

Deno.test("useId should return same id when rerender", () => {
  const { result, rerender } = renderHook(() => useId(), {
    wrapper: SSRProvider,
  });

  expect(result.current).toEqual({ id: `atomic-ui-0`, index: 0 });

  rerender();
  expect(result.current).toEqual({ id: `atomic-ui-0`, index: 0 });
});

Deno.test("useId should return unique id", () => {
  const { result, rerender } = renderHook(() => {
    return [useId(), useId()];
  }, {
    wrapper: SSRProvider,
  });

  expect(result.current[0]).toEqual({ id: `atomic-ui-0`, index: 0 });
  expect(result.current[1]).toEqual({ id: `atomic-ui-1`, index: 1 });

  rerender();

  expect(result.current[0]).toEqual({ id: `atomic-ui-0`, index: 0 });
  expect(result.current[1]).toEqual({ id: `atomic-ui-1`, index: 1 });
});

Deno.test("useId should change prefix", () => {
  const { result } = renderHook(() => {
    return useId({ prefix: "" });
  }, {
    wrapper: SSRProvider,
  });

  expect(result.current).toEqual({ id: `0`, index: 0 });
});
