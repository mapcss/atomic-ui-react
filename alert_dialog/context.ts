// This module is browser compatible.

import { createContext } from "react";
import { noop } from "../deps.ts";
import { Context } from "./types.ts";

export const IdMapContext = createContext({
  title: "",
  describe: "",
});
export const ContextContext = createContext<Context>({
  isShow: false,
  focusNext: noop,
  focusPrev: noop,
});
