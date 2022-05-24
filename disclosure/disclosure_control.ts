// This module is browser compatible.

import {
  AllHTMLAttributes,
  createElement,
  forwardRef as _forwardRef,
  Ref,
} from "react";
import { mergeProps } from "../util.ts";
import { useAs } from "../_shared/hooks.ts";
import { Tag, WithIntrinsicElements } from "../types.ts";
import WithDisclosureControl, {
  Props as WithDisclosureControlProps,
} from "./with_disclosure_control.ts";
import { Contexts } from "./use_disclosure_control.ts";

type _Props<As extends Tag> = {
  /**
   * @default `button`
   */
  as?: As;

  renderAttributes?: (contexts: Contexts) => AllHTMLAttributes<Element>;
} & Omit<WithDisclosureControlProps, "children">;

export type Props<As extends Tag> = WithIntrinsicElements<_Props<As>, As>;

function _DisclosureControl<As extends Tag = "button">(
  { as, renderAttributes, type, on, onKey, keyEntries, ...props }: Props<As>,
  ref: Ref<Element>,
): JSX.Element {
  return WithDisclosureControl({
    children: (attrs, contexts) => {
      const tag = useAs(as, "button");
      const attributes = renderAttributes?.(contexts) ?? {};

      return createElement(
        tag,
        { ref, ...mergeProps(mergeProps(attrs, props), attributes) },
      );
    },
    type,
    on,
    onKey,
    keyEntries,
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
