import { MutableRefObject, RefObject } from "react";

export type States = {
  activeIndex: number;

  itemsRef: MutableRefObject<
    RefObject<HTMLElement | SVGElement | MathMLElement>[]
  >;
};

export type Dispatches = {
  setActiveIndex: (index: number) => void;
};

export type CommonContexts =
  & States
  & Dispatches;
