import { DOMAttributes } from "react";

export type AllHandlerMap = Omit<
  DOMAttributes<Element>,
  "children" | "dangerouslySetInnerHTML"
>;

export type AllHandler = keyof AllHandlerMap;

export type Tag = keyof JSX.IntrinsicElements;
