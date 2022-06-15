import { createElement, forwardRef, ReactNode, Ref, useContext } from "react";
import { IsShowContexts } from "./contexts.ts";
import useTooltipTrigger, {
  AttributesWithContexts,
} from "./use_tooltip_trigger.ts";
import { Tag } from "../types.ts";
import { ERROR_MSG } from "./constants.ts";

export type Props<As extends Tag> = {
  /**
   * `div`
   */
  as?: As;

  children?: ReactNode;
} & AttributesWithContexts;

function TooltipTrigger<As extends Tag = "span">(
  {
    as = "span" as As,
    children,
    ...allAttributes
  }: Readonly<Props<As>>,
  ref: Ref<Element>,
): JSX.Element | never {
  const isShowProps = useContext(IsShowContexts);

  if (!isShowProps) throw Error(ERROR_MSG);

  const [attributes] = useTooltipTrigger(isShowProps, allAttributes);

  return createElement(as, { ref, ...attributes }, children);
}

export default forwardRef(TooltipTrigger);
