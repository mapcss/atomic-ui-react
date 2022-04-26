// This module is browser compatible.

import { useContext, useMemo } from "react";
import { isBrowser } from "../util.ts";
import { joinChars } from "../deps.ts";
import _Context from "./context.ts";
import { _DEFAULT_CONTEXT } from "./constant.ts";

export default function _useSSRSafeId(defaultId?: string): string {
  const ctx = useContext(_Context);

  if (ctx === _DEFAULT_CONTEXT && !isBrowser) {
    console.warn(
      "[atomic-ui] When server rendering, you must wrap your application in an <SSRProvider> to ensure consistent ids are generated between the client and server.",
    );
  }

  return useMemo(
    () => defaultId || joinChars(["atomic-ui", ctx.prefix, ++ctx.current], "-"),
    [defaultId],
  );
}
