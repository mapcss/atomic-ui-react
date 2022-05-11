// This module is browser compatible.

import { createContext, Dispatch, RefObject, SetStateAction } from "react";
import { noop } from "../deps.ts";
import { DEFAULT_TEMP_ID, TempIdReturnValue } from "../_shared/util.ts";
import { DEFAULT_IS_HORIZONTAL } from "./constant.ts";

export const TabCountContext = createContext<TempIdReturnValue>(
  DEFAULT_TEMP_ID,
);
export const TabPanelCountContext = createContext<TempIdReturnValue>(
  DEFAULT_TEMP_ID,
);
export const IdContext = createContext<string>("");
export const IndexContext = createContext<
  [number, Dispatch<SetStateAction<number>>]
>([0, noop]);
export const TabRefsContext = createContext<
  RefObject<HTMLElement>[]
>([]);
export const HorizontalContext = createContext<boolean>(DEFAULT_IS_HORIZONTAL);
export const DisabledIdsContext = createContext<number[]>([]);
