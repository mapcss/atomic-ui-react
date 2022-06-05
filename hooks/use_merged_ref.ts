// This module is browser compatible.

import { MutableRefObject, Ref, RefCallback, RefObject, useRef } from "react";
import { isFunction } from "../deps.ts";

export type Returns<E> = [getRef: RefObject<E>, setRef: Ref<E>];

/** Merges refs and makes them referenceable.
 * Returns a set of getter and setter of ref.
 * By binding a `setRef` to a component, you can reference a `RefObject` from a `getRef`.
 * @param ref Any ref other than string.
 * ```tsx
 * import { useMergedRef } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
 * import { forwardRef, useEffect } from "react";
 *
 * forwardRef<Element>((props, ref) => {
 *   const [getRef, setRef] = useMergedRef(ref);
 *   useEffect(() => {
 *     // getRef.current
 *   }, []);
 *   return <div ref={setRef}>Accessible to ref</div>;
 * });
 * ```
 */
export default function useMergedRef<E = Element>(
  ref: Ref<E>,
): Returns<E> {
  const _ref = useRef<E>(null);

  if (!ref) {
    return [_ref, _ref];
  }

  if (isFunction(ref)) {
    const fn: RefCallback<E> = (instance) => {
      ref.call(null, instance);
      (_ref as MutableRefObject<E | null>).current = instance;
    };

    return [_ref, fn];
  }

  return [ref, ref];
}
