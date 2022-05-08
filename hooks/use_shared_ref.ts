// This module is browser compatible.

import { ReactElement, RefObject, useRef } from "react";
import { getRefObject } from "../util.ts";

const ERROR_MSG = "[atomic-ui] Supported ref is only RefObject.";

export default function useSharedRef<T>(
  ...args: ReactElement[]
): RefObject<T> | never {
  const ref = useRef<T>(null);

  for (const arg of args) {
    const result = getRefObject<T>(arg);
    if (!result[0]) continue;

    if (result[1]) {
      return result[1];
    } else {
      throw Error(ERROR_MSG);
    }
  }
  return ref;
}
