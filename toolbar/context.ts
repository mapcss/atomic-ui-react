// This module is browser compatible.

import { createContext } from "react";
import { FocusStrategy, RovingTabIndex } from "../focus/mod.ts";
import { UseIdReturns } from "../hooks/mod.ts";
import { CommonContexts } from "./types.ts";

export const CommonContextsContext = createContext<CommonContexts | undefined>(
  undefined,
);
export const IdContext = createContext<UseIdReturns | undefined>(undefined);
export const FocusStrategyContext = createContext<FocusStrategy>(
  RovingTabIndex,
);
