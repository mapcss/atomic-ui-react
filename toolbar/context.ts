// This module is browser compatible.

import { createContext, RefObject } from "react";
import { VFn } from "../deps.ts";

export const ActiveElementContext = createContext<
  [Element | null, VFn] | undefined
>(undefined);
export const RefsContext = createContext<
  RefObject<HTMLElement | SVGElement | MathMLElement>[] | undefined
>(undefined);
