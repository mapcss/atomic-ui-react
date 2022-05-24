// This module is browser compatible.

import { useCallback, useMemo } from "react";
import { associateWith } from "../deps.ts";
import { AllHandler, AllHandlerMap, Tag } from "../types.ts";

export function useAs<As extends Tag>(as: As | undefined, defaultAs: Tag): Tag {
  return useMemo<Tag>(() => as ?? defaultAs, [as, defaultAs]);
}

export function useEventHandler(
  on: Iterable<AllHandler>,
  // deno-lint-ignore ban-types
  callback: Function,
): AllHandlerMap {
  const handlerMap = useMemo<AllHandlerMap>(() => {
    return associateWith(Array.from(on), () => callback);
  }, [JSON.stringify(on), callback]);

  return handlerMap;
}

export function usePreventDefault(): (event: Event) => void {
  return useCallback<(ev: Event) => void>((ev) => {
    ev.preventDefault();
  }, []);
}
