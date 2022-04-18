// This module is browser compatible.

import { DependencyList, EffectCallback, useEffect } from "react";
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
  useIsomorphicLayoutEffect(() => {
    return onBeforeMount?.();
  }, deps);

  useEffect(() => {
    const onMountCallback = onMount?.();

    let onAfterMountCallback: ReturnType<EffectCallback>;

    const rid = onAfterMount
      ? (() => {
        const callback = (): void => {
          onAfterMountCallback = onAfterMount?.();
        };
        return requestAnimationFrame(callback);
      })()
      : undefined;
    return (): void => {
      onMountCallback?.();
      onAfterMountCallback?.();
      if (isNumber(rid)) {
        cancelAnimationFrame(rid);
      }
      const onBeforeUnMountCallback = onBeforeUnMount?.();
      onBeforeUnMountCallback?.();
    };
  }, deps);
}
