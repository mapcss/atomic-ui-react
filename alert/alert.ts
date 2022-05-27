// This module is browser compatible.

import { createElement, forwardRef as _forwardRef, Ref } from "react";
import { Tag, WithIntrinsicElements } from "../types.ts";
import { useAs } from "../_shared/hooks.ts";
import WithAlert from "./with_alert.ts";

type _Props<As extends Tag> = {
  /**
   * @default `div`
   */
  as?: As;
};

export type Props<As extends Tag> = WithIntrinsicElements<_Props<As>, As>;

function _Alert<As extends Tag = "div">(
  { as, ...props }: Readonly<Props<As>>,
  ref: Ref<Element>,
): JSX.Element {
  return WithAlert({
    children: (attributes) => {
      const tag = useAs(as, "div");
      return createElement(tag, { ref, ...attributes, ...props });
    },
  });
}

const Alert = _forwardRef(_Alert);
export default Alert;

declare module "react" {
  // deno-lint-ignore ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: Ref<T>) => ReactElement | null,
  ): (props: P & RefAttributes<T>) => ReactElement | null;
}
