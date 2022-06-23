import { createElement, forwardRef, ReactNode, Ref } from "react";
import { Exclusive } from "../util.ts";
import { IsShowContexts } from "./contexts.ts";
import { StateSet, Tag } from "../types.ts";
import useTooltipContainer from "./use_tooltip_container.ts";
import { Contexts } from "./types.ts";
import { AllAttributesWith } from "../hooks/mod.ts";
import { useStateSet } from "../hooks/mod.ts";

export type Props<As extends Tag> =
  & {
    /**
     * `div`
     */
    as?: As;

    children?: ReactNode;
  }
  & Exclusive<{
    /** `isShow` and it dispatcher set. */
    isShowSet: StateSet<boolean>;
  }, {
    /**
     * @default false
     */
    initialIsShow?: boolean;
  }>
  & Partial<AllAttributesWith<[Contexts]>>;

function TooltipContainer<As extends Tag = "div">(
  {
    as = "div" as As,
    children,
    initialIsShow = false,
    isShowSet,
    ...allAttributes
  }: Readonly<Props<As>>,
  ref: Ref<Element>,
): JSX.Element {
  const [isShow, setIsShow] = useStateSet<boolean>(initialIsShow, isShowSet);

  const [attributes] = useTooltipContainer(
    { isShow, setIsShow },
    allAttributes,
  );

  return createElement(
    IsShowContexts.Provider,
    { value: { isShow, setIsShow } },
    createElement(as, { ref, ...attributes }, children),
  );
}

export default forwardRef(TooltipContainer);
