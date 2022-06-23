import { MutableRefObject, RefObject } from "react";
import { ActiveIndexProps } from "../_shared/types.ts";

export type States = {
  itemsRef: MutableRefObject<
    RefObject<HTMLElement | SVGElement>[]
  >;
};

export type Dispatches = {
  setActiveIndex: (index: number) => void;
};

export type CommonContexts =
  & ActiveIndexProps
  & States;
