// This module is browser compatible.

import { createContext, MutableRefObject, RefObject } from "react";
import { Returns as UseIdReturns } from "../hooks/use_id.ts";

export const ActiveIndexStateSetContext = createContext<
  [number, (index: number) => void] | undefined
>(
  undefined,
);
export const ItemsRefContext = createContext<
  | MutableRefObject<RefObject<HTMLElement | SVGElement | MathMLElement>[]>
  | undefined
>(undefined);
export const IdContext = createContext<UseIdReturns | undefined>(undefined);
