// This module is browser compatible.

import { AllHTMLAttributes, DOMAttributes } from "react";

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

export type ElementProps<
  As extends Tag,
  Contexts extends Record<PropertyKey, unknown>,
  E = Element,
> = {
  renderAttributes?: (contexts: Contexts) => AllHTMLAttributes<E>;
} & AsProps<As>;

export type AsProps<As extends Tag> = {
  /** Render tag as */
  as?: As;
};

export type HasFocusElement = HTMLElement | SVGElement | MathMLElement;

export type HandlerWithContext<
  Context,
  K extends keyof HandlersWithContext<Context>,
> = Required<HandlersWithContext<Context>>[K];

export type HandlersWithContext<Context> = {
  [k in keyof AllHandlerMap]?: (
    event: Parameters<Required<AllHandlerMap>[k]>[0],
    context: Context,
  ) => ReturnType<Required<AllHandlerMap>[k]>;
};
