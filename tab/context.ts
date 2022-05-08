// This module is browser compatible.

import { createContext, Dispatch, RefObject, SetStateAction } from "react";
import { noop } from "../deps.ts";

export const TabCountContext = createContext<{ readonly current: number }>({
  current: 0,
});
export const TabPanelCountContext = createContext<{ readonly current: number }>(
  { current: 0 },
);
export const IdContext = createContext<string>("");
export const IndexContext = createContext<
  [number, Dispatch<SetStateAction<number>>]
>([0, noop]);
export const TabRefsContext = createContext<
  RefObject<HTMLElement>[]
>([]);
export const HorizontalContext = createContext<boolean>(true);
