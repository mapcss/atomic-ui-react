// This module is browser compatible.

import {
  createElement,
  ForwardedRef,
  forwardRef,
  ReactNode,
  useContext,
} from "react";
import { Tag } from "../types.ts";
import { IsShowContexts } from "./contexts.ts";
import useTooltip from "./use_tooltip.ts";
import { Contexts } from "./types.ts";
import { AllAttributesWith } from "../hooks/mod.ts";
import { ERROR_MSG } from "./constants.ts";

export type Props<As extends Tag> = {
  /**
   * @default `span`
   */
  as?: As;

  children?: ReactNode;
} & Partial<AllAttributesWith<[Contexts]>>;

function Tooltip<As extends Tag = "div">(
  { as = "div" as As, children, ...allAttributes }: Readonly<Props<As>>,
  ref: ForwardedRef<As>,
) {
  const isShowProps = useContext(IsShowContexts);
  if (!isShowProps) throw Error(ERROR_MSG);

  const [attributes] = useTooltip(isShowProps, allAttributes);

  return createElement(as, { ref, ...attributes }, children);
}

export default forwardRef(Tooltip);
