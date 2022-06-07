import useKeyId from "./use_key_id.ts";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "../dev_deps.ts";
import SSRProvider from "../ssr/ssr_provider.ts";

Deno.test("useKeyId should return 0 when store is not exists", () => {
  const store = {};
  const { result, rerender } = renderHook(() => useKeyId({ key: "", store }), {
    wrapper: SSRProvider,
  });

  expect(result.current).toBe(0);
  expect(store).toEqual({ "": 0 });

  rerender();
  expect(result.current).toBe(0);
  expect(store).toEqual({ "": 0 });
});

Deno.test("useKeyId should return incremental id when store is exists", () => {
  const store = { "": 5 };
  const { result, rerender } = renderHook(() => useKeyId({ key: "", store }), {
    wrapper: SSRProvider,
  });

  expect(result.current).toBe(6);
  expect(store).toEqual({ "": 6 });

  rerender();

  expect(result.current).toBe(6);
  expect(store).toEqual({ "": 6 });
});
