// This module is browser compatible.

import { createElement, forwardRef as _forwardRef, Ref } from "react";
import { useAs } from "../_shared/hooks.ts";
import { Tag, WithIntrinsicElements } from "../types.ts";
import WithDisclosureControl, {
  Props as WithDisclosureControlProps,
} from "./with_disclosure_control.ts";

type _Props<As extends Tag> = {
  /**
   * @default `button`
   */
  as?: As;
} & Omit<WithDisclosureControlProps, "children">;

export type Props<As extends Tag> = WithIntrinsicElements<_Props<As>, As>;

function _DisclosureControl<As extends Tag = "button">(
  { as, mutateType, children, ...props }: Props<As>,
  ref: Ref<Element>,
): JSX.Element {
  return WithDisclosureControl({
    children: (attrs) => {
      const tag = useAs(as, "button");

      return createElement(tag, { ref, ...attrs, children });
    },
    mutateType,
    ...props,
  });
}

const DisclosureControl = _forwardRef(_DisclosureControl);
export default DisclosureControl;

declare module "react" {
  // deno-lint-ignore ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: Ref<T>) => ReactElement | null,
  ): (props: P & RefAttributes<T>) => ReactElement | null;
}
