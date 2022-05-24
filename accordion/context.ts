// This module is browser compatible.

import { createContext, Dispatch, RefObject, SetStateAction } from "react";
import { TempIdReturnValue } from "../_shared/util.ts";

export const IdContext = createContext<string | undefined>(undefined);
export const IndexContext = createContext<
  [number, Dispatch<SetStateAction<number>>] | undefined
>(undefined);
export const HeaderCountContext = createContext<TempIdReturnValue | undefined>(
  undefined,
);
export const PanelCountContext = createContext<TempIdReturnValue | undefined>(
  undefined,
);
export const RefsContext = createContext<RefObject<HTMLElement | SVGElement>[]>(
  [],
);
