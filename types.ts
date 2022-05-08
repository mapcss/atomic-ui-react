import { DOMAttributes } from "react";

export type AllHandlerMap = Omit<
  DOMAttributes<Element>,
  "children" | "dangerouslySetInnerHTML"
>;
