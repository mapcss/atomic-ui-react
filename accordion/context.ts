// This module is browser compatible.

import { createContext, RefObject } from "react";
import { CommonContexts } from "./types.ts";

export const IdContext = createContext<string | undefined>(undefined);
export const RefsContext = createContext<RefObject<HTMLElement | SVGElement>[]>(
  [],
);

export const CommonContextsContext = createContext<CommonContexts | undefined>(
  undefined,
);
