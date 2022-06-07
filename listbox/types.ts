import { MutableRefObject, RefObject } from "react";
import { Fn } from "../deps.ts";

export type ActiveIndexes = {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
};

export type SelectIndexes = {
  selectIndex: number | undefined;
  setSelectIndex: (index: number | undefined) => void;
};

type PickBy<T, V> = {
  [k in keyof T as T[k] extends V ? k : never]: T[k];
};
type OmitBy<T, V> = {
  [k in keyof T as T[k] extends V ? never : k]: T[k];
};

export type States = {
  childrenRef: MutableRefObject<
    RefObject<HTMLElement | SVGElement | MathMLElement>[]
  >;
} & OmitBy<ActiveIndexes | SelectIndexes, Fn<never>>;

export type Dispatches = PickBy<ActiveIndexes | SelectIndexes, Fn<never>>;

export type CommonContexts =
  & {
    childrenRef: MutableRefObject<
      RefObject<HTMLElement | SVGElement | MathMLElement>[]
    >;
  }
  & ActiveIndexes
  & SelectIndexes;
