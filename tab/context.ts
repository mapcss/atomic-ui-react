// This module is browser compatible.

import { createContext } from "react";
import { DEFAULT_IS_HORIZONTAL } from "./constant.ts";
import { CommonContexts } from "./types.ts";

export const IdContext = createContext<string | undefined>(undefined);
export const HorizontalContext = createContext<boolean>(DEFAULT_IS_HORIZONTAL);
export const DisabledIdsContext = createContext<number[]>([]);

export const CommonContextsContext = createContext<CommonContexts | undefined>(
  undefined,
);
