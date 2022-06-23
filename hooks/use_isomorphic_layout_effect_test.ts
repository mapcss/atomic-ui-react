import useIsomorphicLayoutEffect from "./use_isomorphic_layout_effect.ts";
import { expect, fn } from "../dev_deps.ts";
import { renderHook } from "@testing-library/react-hooks";

Deno.test("useIsomorphicLayoutEffect should not output warning", () => {
  const mock = fn();
  renderHook(() =>
    useIsomorphicLayoutEffect(() => {
      mock();
    })
  );

  expect(mock).toHaveBeenCalled();
});
