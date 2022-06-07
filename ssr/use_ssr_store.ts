// This module is browser compatible.

import { useContext } from "react";
import { isBrowser } from "../util.ts";
import Context from "./context.ts";
import { defaultStore, ERROR_MSG } from "./constant.ts";
import { Store } from "../hooks/use_key_id.ts";

export default function useSSRStore(): Store {
  const ctx = useContext(Context);

  if (ctx === defaultStore && !isBrowser) {
    console.warn(ERROR_MSG);
  }

  return ctx.current;
}
