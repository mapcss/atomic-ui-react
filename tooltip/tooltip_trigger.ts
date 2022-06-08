import { createElement, ReactNode, useContext } from "react";
import { IsShowContexts } from "./contexts.ts";
import useTooltipTrigger from "./use_tooltip_trigger.ts";
import { IsShowProps } from "./types.ts";
import { Exclusive } from "../util.ts";
import { Tag } from "../types.ts";
import { ERROR_MSG } from "./constants.ts";

export type Props<As extends Tag> = Exclusive<IsShowProps, {
  /**
   * @default false
   */
  initialIsShow?: boolean;

  /**
   * `div`
   */
  as?: As;

  children?: ReactNode;
}>;
export default function TooltipContainer<As extends Tag = "span">(
  {
    as = "span" as As,
    children,
  }: Readonly<Props<As>>,
): JSX.Element | never {
  const isShowProps = useContext(IsShowContexts);

  if (!isShowProps) throw Error(ERROR_MSG);

  const [attributes] = useTooltipTrigger(isShowProps);

  return createElement(as, attributes, children);
}
