// This module is browser compatible.

import {
  createElement,
  forwardRef as _forwardRef,
  ReactNode,
  Ref,
} from "react";
import { Tag, WithIntrinsicElements } from "../types.ts";
import WithDisclosureControl, {
  Props as WithDisclosureControlProps,
} from "./with_disclosure_control.ts";

type _Props<As extends Tag> = {
  /**
   * @default `button`
   */
  as?: As;

  children?: ReactNode;
} & Omit<WithDisclosureControlProps, "children">;

export type Props<As extends Tag> = WithIntrinsicElements<_Props<As>, As>;

function _DisclosureControl<As extends Tag = "button">(
  { as = "button" as As, mutateType, children, ...props }: Props<As>,
  ref: Ref<Element>,
): JSX.Element {
  return WithDisclosureControl({
    children: (attrs) => {
      return createElement(as, { ref, ...attrs }, children);
    },
    mutateType,
    ...props,
  });
}

const DisclosureControl = _forwardRef(_DisclosureControl);
export default DisclosureControl;
