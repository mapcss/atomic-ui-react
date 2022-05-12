import { createElement, forwardRef as _forwardRef, Ref } from "react";
import WithAccordionHeader, {
  Props as WithAccordionHeaderProps,
} from "./with_accordion_header.ts";
import { mergeProps } from "../util.ts";
import { useAs } from "../_shared/hooks.ts";
import { Tag, WithIntrinsicElements } from "../types.ts";

type _Props<As extends Tag> = {
  /**
   * @default `button`
   */
  as?: As;
} & Pick<WithAccordionHeaderProps, "on" | "onKey">;

export type Props<As extends Tag> = WithIntrinsicElements<_Props<As>, As>;

function _AccordionHeader<As extends Tag = "button">(
  { as, on, onKey, ...props }: Props<As>,
  ref: Ref<Element>,
): JSX.Element {
  return WithAccordionHeader({
    children: (attributes) => {
      const tag = useAs(as, "button");
      return createElement(tag, { ref, ...mergeProps(attributes, props) });
    },
    onKey,
    on,
  });
}

const AccordionHeader = _forwardRef(_AccordionHeader);
export default AccordionHeader;
