// This module is browser compatible.

import { useCallback } from "react";
import { resolveLazy } from "../util.ts";

type EventLike = { currentTarget: EventTarget | null };

export type Params<Ev extends EventLike> = {
  /** Criteria target to determine if outside. */
  target:
    | EventTarget
    | null
    | undefined
    | (() => EventTarget | null | undefined);

  /** Call on `target` is outside of the current target. */
  callback: (ev: Ev) => void;
};

export type Options<Ev extends EventLike> = {
  /** Callback called if current target is not outside, contains current target. */
  innerCallback: (ev: Ev) => void;

  /** Comparison function for outside or not.
   * @defaultValue {@link defaultCompare}
   */
  compare: (current: Node, target: Node) => boolean;
};

/** Make callback that call outside of target.
 * ```tsx
 * import { useOutside } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
 * import { MouseEvent, useRef } from "react";
 *
 * export default () => {
 *   const ref = useRef<HTMLDivElement>(null);
 *   const callback = useOutside<MouseEvent>({
 *     target: () => ref.current,
 *     callback: (ev) => {
 *       console.log("call on outside", ev);
 *     },
 *   });
 *
 *   return (
 *     <div onClick={callback}>
 *       outer
 *       <div ref={ref}>inner</div>
 *     </div>
 *   );
 * };
 * ```
 */
export default function useOutside<Ev extends EventLike>(
  { target, callback }: Readonly<Params<Ev>>,
  { innerCallback, compare = defaultCompare }: Partial<Options<Ev>> = {},
): (ev: Ev) => void {
  const call = useCallback<(ev: Ev) => void>(
    (ev) => {
      const eventTarget = resolveLazy(target);
      if (
        !ev.currentTarget || !isNode(ev.currentTarget) || !eventTarget ||
        !isNode(eventTarget)
      ) {
        return;
      }

      if (compare(ev.currentTarget, eventTarget)) {
        callback.call(null, ev);
      } else {
        innerCallback?.call(null, ev);
      }
    },
    [target, callback, innerCallback, compare],
  );

  return call;
}

function defaultCompare(current: Node, node: Node): boolean {
  return !current.contains(node);
}

// deno-lint-ignore ban-types
function isNode(value: object): value is Node {
  return value instanceof Node;
}
