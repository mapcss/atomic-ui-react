import {
  DependencyList,
  EffectCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import useIsFirstMount from "./use_is_first_mount.ts";

export type Options = {
  /** Function to call `effect`.
   * It must be the same interface as {@link useEffect} and {@link useLayoutEffect}.
   * @defaultValue {@link useEffect}
   */
  effector: typeof useLayoutEffect | typeof useLayoutEffect;
};

/** Accepts a function that contains imperative, possibly effectful code.
 * It is not called at first rendering, and the side effect is executed only at re-rendering.
 * ```tsx
 * import { useUpdateEffect } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
 *
 * export default () => {
 *   useUpdateEffect(() => {});
 * };
 * ```
 */
export default function useUpdateEffect(
  /** Imperative function that can return a cleanup function. */
  effect: EffectCallback,
  /** If present, effect will only activate if the values in the list change.
   * @remark If an empty dependency list is passed, the `effect` will never be executed.
   */
  deps?: DependencyList,
  { effector = useEffect }: Readonly<Partial<Options>> = {},
): void {
  const { isFirstMount } = useIsFirstMount();
  effector(() => {
    if (isFirstMount) return;

    return effect();
  }, deps);
}
