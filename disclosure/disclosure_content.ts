// This module is browser compatible.

import { createElement, forwardRef as _forwardRef, Ref } from "react";
import { Tag } from "../types.ts";
import WithDisclosureContent, {
  Props as WithDisclosureProps,
} from "./with_disclosure_content.ts";
import { WithIntrinsicElements } from "../types.ts";

type _Props<As extends Tag> = {
  as?: As;
} & Omit<WithDisclosureProps, "children">;

export type Props<As extends Tag> = WithIntrinsicElements<_Props<As>, As>;

function _DisclosureContent<As extends Tag = "div">(
  { as = "div" as As, children, ...props }: Props<As>,
  ref: Ref<Element>,
): JSX.Element {
  return WithDisclosureContent({
    children: (attrs) => {
      return createElement(as, { ref, ...attrs, children });
    },
    ...props,
  });
}

const DisclosureContent = _forwardRef(_DisclosureContent);
export default DisclosureContent;
