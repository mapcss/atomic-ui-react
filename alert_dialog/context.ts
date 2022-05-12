// This module is browser compatible.

import { createContext } from "react";
import { noop } from "../deps.ts";
import { RenderContext } from "./types.ts";

export const IdMapContext = createContext({
  title: "",
  describe: "",
});
export const RenderContextContext = createContext<RenderContext>({
  isShow: false,
  focusNext: noop,
  focusPrev: noop,
});
