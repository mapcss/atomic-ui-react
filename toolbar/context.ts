import { createContext, RefObject } from "react";
import { noop, VFn } from "../deps.ts";

export const ActiveElementContext = createContext<
  [Element | null, VFn]
>([null, noop]);
export const RefsContext = createContext<
  RefObject<HTMLElement | SVGElement | MathMLElement>[]
>([]);
