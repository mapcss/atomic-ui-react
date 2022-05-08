// This module is browser compatible.

import { createContext, Dispatch, RefObject, SetStateAction } from "react";
import { noop } from "../deps.ts";
import { TempIdReturnValue } from "./util.ts";
import { DEFAULT_IS_HORIZONTAL } from "./constant.ts";

export const TabCountContext = createContext<TempIdReturnValue>({
  current: 0,
});
export const TabPanelCountContext = createContext<TempIdReturnValue>(
  { current: 0 },
);
export const IdContext = createContext<string>("");
export const IndexContext = createContext<
  [number, Dispatch<SetStateAction<number>>]
>([0, noop]);
export const TabRefsContext = createContext<
  RefObject<HTMLElement>[]
>([]);
export const HorizontalContext = createContext<boolean>(DEFAULT_IS_HORIZONTAL);
