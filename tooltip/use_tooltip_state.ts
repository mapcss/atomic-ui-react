import { DependencyList, useEffect } from "react";
import { ElementLike, resolveElementLike } from "../util.ts";
import { Useable } from "../hooks/types.ts";
import useBoolean, { ReturnValue } from "../hooks/use_boolean.ts";
export type Param = {
  enterEvents: Iterable<string>;
  leaveEvents: Iterable<string>;
  target: ElementLike;
};
export type Option = {
  eventListenerOptions: AddEventListenerOptions | boolean;
} & Useable;

export default function useTooltipState(
  { enterEvents, leaveEvents, target }: Readonly<Param>,
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

    const enters = Array.from(enterEvents);
    const leaves = Array.from(leaveEvents);

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
