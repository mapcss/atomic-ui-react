// This module is browser compatible.

import {
  AllHTMLAttributes,
  createElement,
  forwardRef as _forwardRef,
  Ref,
} from "react";
import { mergeProps } from "../util.ts";
import { useAs } from "../_shared/hooks.ts";
import { Tag } from "../types.ts";
import WithDisclosureControl, {
  Props as WithDisclosureControlProps,
} from "./with_disclosure_control.ts";
import { DispatchMap, StateMap } from "./types.ts";

type _Props<As extends Tag> = {
  /**
   * @default `button`
   */
  as?: As;

  propsAs?: (context: StateMap & DispatchMap) => AllHTMLAttributes<Element>;
} & Omit<WithDisclosureControlProps, "children">;

export type Props<As extends Tag> =
  & _Props<As>
  & Omit<JSX.IntrinsicElements[As], keyof _Props<As>>;

function _DisclosureControl<As extends Tag = "button">(
  { as, propsAs, type, on, ...props }: Props<As>,
  ref: Ref<Element>,
): JSX.Element {
  return WithDisclosureControl({
    children: (attrs, context) => {
      const tag = useAs(as, "button");
      const propsWith = propsAs?.(context) ?? {};

      return createElement(
        tag,
        { ref, ...mergeProps(mergeProps(attrs, props), propsWith) },
      );
    },
    type,
    on,
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
