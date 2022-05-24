// This module is browser compatible.

import { DOMAttributes } from "react";

export type AllHandlerMap = Omit<
  DOMAttributes<Element>,
  "children" | "dangerouslySetInnerHTML"
>;

export type AllHandler = keyof AllHandlerMap;

export type AllHandlerMapWithoutKeyBoard = Omit<
  AllHandlerMap,
  "onKeyDown" | "onKeyUp" | "onKeyPress"
>;
export type AllHandlerWithoutKeyBoard = keyof AllHandlerMapWithoutKeyBoard;

export type KeyboardHandlerMap = Pick<
  AllHandlerMap,
  "onKeyDown" | "onKeyUp" | "onKeyPress"
>;
export type KeyboardHandler = keyof KeyboardHandlerMap;

export type Tag = keyof JSX.IntrinsicElements;

export type WithIntrinsicElements<Props, As extends Tag> =
  & Props
  & Omit<JSX.IntrinsicElements[As], keyof Props>;
export type KeyboardEventHandler = (ev: KeyboardEvent) => void;
