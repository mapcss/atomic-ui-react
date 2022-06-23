// This module is browser compatible.

import {
  createElement,
  forwardRef as _forwardRef,
  PropsWithChildren,
  Ref,
} from "react";
import { Tag } from "../types.ts";
import WithAlert, { Props as WithAlertProps } from "./with_alert.ts";

export type Props<As extends Tag> = PropsWithChildren<
  {
    /**
     * @default `div`
     */
    as?: As;
  } & Omit<WithAlertProps, "children">
>;

function _Alert<As extends Tag = "div">(
  { as = "div" as As, children, ...props }: Readonly<Props<As>>,
  ref: Ref<Element>,
): JSX.Element {
  return WithAlert({
    children: (attributes) => {
      return createElement(as, { ref, ...attributes }, children);
    },
    ...props,
  });
}

const Alert = _forwardRef(_Alert);
export default Alert;
