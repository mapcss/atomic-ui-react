import useDisclosure from "./use_disclosure.ts";
import SSRProvider from "../ssr/ssr_provider.ts";
import { act, renderHook } from "@testing-library/react-hooks";
import { anyFunction, anyString, expect } from "../dev_deps.ts";

Deno.test("useDisclosure should return stateMap and dispatchMap", () => {
  const { result } = renderHook(() => useDisclosure(), {
    wrapper: SSRProvider,
  });

  expect(result.current).toEqual([{
    id: anyString(),
    isOpen: false,
  }, {
    open: anyFunction(),
    close: anyFunction(),
    toggle: anyFunction(),
  }]);
});

Deno.test("useDisclosure should change isOpen if the dispatch is called", () => {
  const { result } = renderHook(() => useDisclosure(true), {
    wrapper: SSRProvider,
  });

  expect(result.current[0].isOpen).toBeTruthy();

  act(() => {
    result.current[1].close();
  });
  expect(result.current[0].isOpen).toBeFalsy();
  act(() => {
    result.current[1].open();
  });
  expect(result.current[0].isOpen).toBeTruthy();
  act(() => {
    result.current[1].toggle();
  });
  expect(result.current[0].isOpen).toBeFalsy();
  act(() => {
    result.current[1].toggle();
  });
  expect(result.current[0].isOpen).toBeTruthy();
});
