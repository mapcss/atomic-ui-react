// This module is browser compatible.

import { RefObject, useRef } from "react";

export type ReturnValue = {
  isFirstMount: boolean;
  _ref: RefObject<boolean>;
};

/**
 * Ref of first mount or not.
 *
 * @example
 * ```tsx
 * import { useIsFirstMount } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts"
 * // in-component
 * const { isFirstMount } = useIsFirstMount()
 * // isFirstMount: true
 * // re-render
 * // isFirstMount: false
 * ```
 */
export default function useIsFirstMount(): ReturnValue {
  const isFirstMount = useRef<boolean>(true);

  if (isFirstMount.current) {
    isFirstMount.current = false;

    return {
      isFirstMount: true,
      _ref: isFirstMount,
    };
  }

  return {
    isFirstMount: isFirstMount.current,
    _ref: isFirstMount,
  };
}