// This module is browser compatible.

import { createContext, Dispatch, RefObject, SetStateAction } from "react";
import { TempIdReturnValue } from "../_shared/util.ts";
import { DEFAULT_IS_HORIZONTAL } from "./constant.ts";

export const TabCountContext = createContext<TempIdReturnValue | undefined>(
  undefined,
);
export const TabPanelCountContext = createContext<
  TempIdReturnValue | undefined
>(
  undefined,
);
export const IdContext = createContext<string | undefined>(undefined);
export const IndexContext = createContext<
  [number, Dispatch<SetStateAction<number>>] | undefined
>(undefined);
export const TabRefsContext = createContext<
  RefObject<HTMLElement>[]
>([]);
export const HorizontalContext = createContext<boolean>(DEFAULT_IS_HORIZONTAL);
export const DisabledIdsContext = createContext<number[]>([]);
