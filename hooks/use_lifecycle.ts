// This module is browser compatible.

import { DependencyList, EffectCallback, useEffect } from "react";
import useIsomorphicLayoutEffect from "../hooks/use_isomorphic_layout_effect.ts";

export type Param = {
  /** Call on `useLayoutEffect` hooks. */
  onBeforeMount: EffectCallback;

  /** Call on `useEffect` hooks. */
  onMounted: EffectCallback;

  /** Call on next frame of mount. */
  onAfterMounted: EffectCallback;

  /** Call on before unmount. */
  onBeforeUnMount: () => void;
};

/** Hooks for component lifecycle.
 * Some callbacks can return a callback function to be executed before mounting.
 * ```tsx
 * import { useLifecycle } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts"
 * useLifecycle({
 *   onBeforeMount: () => {
 *     // call on same as `useLayoutHook`
 *   },
 *   onMounted: () => {
 *     // call on same as `useEffect`
 *   },
 *   onAfterMounted: () => {
 *     // call on next frame of mount
 *   },
 *   onBeforeUnMount: () => {
 *     // call on before unmount
 *   },
 * }, []);
 * ```
 */
export default function useLifecycle(
  { onBeforeMount, onMounted, onAfterMounted, onBeforeUnMount }: Readonly<
    Partial<Param>
  >,
  deps?: DependencyList,
): void {
  useIsomorphicLayoutEffect(() => {
    return onBeforeMount?.();
  }, deps);

  useEffect(() => {
    const onMountedCallback = onMounted?.();
    let onAfterMountCallback: ReturnType<EffectCallback>;

    const rid = onAfterMounted
      ? (() => {
        const callback = (): void => {
          onAfterMountCallback = onAfterMounted?.();
        };
        return requestAnimationFrame(callback);
      })()
      : undefined;

    return (): void => {
      onMountedCallback?.();
      onAfterMountCallback?.();
      if (rid) {
        cancelAnimationFrame(rid);
      }
      onBeforeUnMount?.();
    };
  }, deps);
}
