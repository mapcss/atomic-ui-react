// This module is browser compatible.

import { KeyboardEventHandler, useCallback } from "react";
import { KeyEntries, mappingKey } from "../_shared/util.ts";

export type Param = KeyEntries;
export type ReturnValue = KeyboardEventHandler<Element>;

/** Hooks for mapping keyboard event and callback */
export default function useKeyboardHandler(
  keyEntries: Param,
): ReturnValue {
  const callback = useCallback<ReturnValue>(
    mappingKey(keyEntries),
    [
      JSON.stringify(keyEntries),
    ],
  );

  return callback;
}
