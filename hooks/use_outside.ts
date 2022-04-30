// This module is browser compatible.

import { DependencyList, useEffect } from "react";
import { ValueOf } from "../deps.ts";
import { Useable } from "../hooks/types.ts";
import { ElementLike, resolveElementLike, resolveEventType } from "../util.ts";

export type Param<E extends Element = Element> = {
  target: ElementLike<E>;
  event: Iterable<keyof DocumentEventMap> | keyof DocumentEventMap;
  callback: (event: ValueOf<DocumentEventMap>) => void;
};

export type Option = {
  eventListenerOptions: AddEventListenerOptions | boolean;
} & Useable;

/** Fire event on outside element  */
export default function useOutside<E extends Element = Element>(
  { target, callback, event }: Readonly<Param<E>>,
  { use = true, eventListenerOptions = { passive: true } }: Readonly<
    Partial<Option>
  > = {},
  deps?: DependencyList,
): void {
  useEffect(() => {
    if (!use) return;
    const el = resolveElementLike(target);
    if (!el) return;

    const listener = (event: ValueOf<DocumentEventMap>): void => {
      if (!event.target || !(event.target instanceof Node)) return;
      if (!el.contains(event.target)) {
        callback(event);
      }
    };

    const events = resolveEventType(event);

    events.forEach((event) => {
      document.addEventListener(event, listener, eventListenerOptions);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, listener, eventListenerOptions);
      });
    };
  }, deps);
}
