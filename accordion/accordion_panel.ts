import { createElement, forwardRef as _forwardRef, Ref } from "react";
import WithAccordionPanel from "./with_accordion_panel.ts";
import { useAs } from "../_shared/hooks.ts";
import { mergeProps } from "../util.ts";
import { Tag, WithIntrinsicElements } from "../types.ts";

type _Props<As extends Tag> = {
  as?: As;
};

export type Props<As extends Tag> = WithIntrinsicElements<_Props<As>, As>;

function _AccordionPanel<As extends Tag>(
  { as, ...props }: Props<As>,
  ref: Ref<Element>,
): JSX.Element {
  return WithAccordionPanel({
    children: (attributes) => {
      const tag = useAs(as, "div");
      return createElement(tag, { ref, ...mergeProps(attributes, props) });
    },
  });
}

const AccordionPanel = _forwardRef(_AccordionPanel);
export default AccordionPanel;
