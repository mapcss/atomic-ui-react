// This module is browser compatible.

import { DependencyList, EffectCallback, useEffect, useRef } from "react";
import useIsomorphicLayoutEffect from "../hooks/use_isomorphic_layout_effect.ts";
import { isNumber } from "../deps.ts";

export type Param = {
  onBeforeMount: EffectCallback;
  onMount: EffectCallback;
  onAfterMount: EffectCallback;
  onBeforeUnMount: EffectCallback;
};
export default function useOnMount(
  { onBeforeMount, onMount, onAfterMount, onBeforeUnMount }: Readonly<
    Partial<Param>
  >,
  { deps }: { deps?: DependencyList } = {},
): void {
  const onAfterMountCallbackRef = useRef<ReturnType<EffectCallback>>();
  onAfterMountCallbackRef.current = undefined;
  useIsomorphicLayoutEffect(() => {
    return onBeforeMount?.();
  }, deps);

  useEffect(() => {
    const onMountCallback = onMount?.();

    const rid = onAfterMount
      ? (() => {
        const callback = (): void => {
          onAfterMountCallbackRef.current = onAfterMount?.();
        };
        return requestAnimationFrame(callback);
      })()
      : undefined;
    return (): void => {
      onMountCallback?.();
      onAfterMountCallbackRef.current?.();
      if (isNumber(rid)) {
        cancelAnimationFrame(rid);
      }
      const onBeforeUnMountCallback = onBeforeUnMount?.();
      onBeforeUnMountCallback?.();
    };
  }, deps);
}
