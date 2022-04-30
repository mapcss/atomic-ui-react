import { DependencyList, useEffect } from "react";
import { ElementLike, resolveElementLike, resolveEventType } from "../util.ts";
import { Useable } from "../hooks/types.ts";
import useBoolean, { ReturnValue } from "../hooks/use_boolean.ts";

export type Param = {
  enterEvent: string | Iterable<string>;
  leaveEvent: string | Iterable<string>;
  target: ElementLike;
};
export type Option = {
  eventListenerOptions: AddEventListenerOptions | boolean;
} & Useable;

export default function useTooltipState(
  { enterEvent, leaveEvent, target }: Readonly<Param>,
  { use = true, eventListenerOptions = { passive: true } }: Readonly<
    Partial<Option>
  > = {},
  deps?: DependencyList,
): ReturnValue {
  const [state, { on, off, toggle }] = useBoolean();

  useEffect(() => {
    if (!use) return;
    const el = resolveElementLike(target);
    if (!el) return;

    const enters = resolveEventType(enterEvent);
    const leaves = resolveEventType(leaveEvent);

    enters.forEach((type) => {
      el.addEventListener(type, on, eventListenerOptions);
    });
    leaves.forEach((type) => {
      el.addEventListener(type, off, eventListenerOptions);
    });
    return () => {
      enters.forEach((type) => {
        el.removeEventListener(type, on, eventListenerOptions);
      });
      leaves.forEach((type) => {
        el.removeEventListener(type, off, eventListenerOptions);
      });
    };
  }, deps);

  return [state, { on, off, toggle }];
}
