// This module is browser compatible.

import { useCallback } from "react";
import { KeyboardHandler, KeyboardHandlerMap } from "../types.ts";
import { KeyEntries, mappingKey } from "../_shared/util.ts";
import { useEventHandler } from "../_shared/hooks.ts";

export type Param = {
  keyEntries: KeyEntries;
  on: Iterable<KeyboardHandler>;
};
export type ReturnValue = KeyboardHandlerMap;

export default function useKeyboardHandler({
  keyEntries,
  on,
}: Param): KeyboardHandlerMap {
  const callback = useCallback(mappingKey(keyEntries), [
    JSON.stringify(keyEntries),
  ]);

  const handlerMap = useEventHandler(on, callback);
  return handlerMap;
}
