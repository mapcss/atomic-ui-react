// This module is browser compatible.

import { createContext, Dispatch, RefObject, SetStateAction } from "react";
import { noop } from "../deps.ts";
import { DEFAULT_TEMP_ID, TempIdReturnValue } from "../_shared/util.ts";

export const IdContext = createContext<string>("");
export const IndexContext = createContext<
  [number, Dispatch<SetStateAction<number>>]
>([0, noop]);
export const HeaderCountContext = createContext<TempIdReturnValue>(
  DEFAULT_TEMP_ID,
);
export const PanelCountContext = createContext<TempIdReturnValue>(
  DEFAULT_TEMP_ID,
);
export const RefsContext = createContext<RefObject<HTMLElement>[]>([]);
