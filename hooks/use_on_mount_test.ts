import useOnMount from "./use_on_mount.ts";
import { renderHook } from "@testing-library/react-hooks";
import { expect, fn } from "../dev_deps.ts";

Deno.test(
  "useOnMount",
  () => {
    const mockFn = fn();
    renderHook(() =>
      useOnMount({
        onBeforeMount: () => {
          mockFn(1);
        },
        onMount: () => {
          mockFn(2);
        },
      })
    );

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenNthCalledWith(1, 1);
    expect(mockFn).toHaveBeenNthCalledWith(2, 2);
  },
);
