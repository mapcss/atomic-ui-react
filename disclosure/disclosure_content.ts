// This module is browser compatible.

import {
  AllHTMLAttributes,
  cloneElement,
  createElement,
  forwardRef as _forwardRef,
  Ref,
} from "react";
import { Tag } from "../types.ts";
import { mergeProps } from "../util.ts";
import { useAs } from "../_shared/hooks.ts";
import WithDisclosureContent from "./with_disclosure_content.ts";
import { DispatchMap, StateMap } from "./types.ts";
import { WithIntrinsicElements } from "../types.ts";

type _Props<As extends Tag> = {
  as?: As;

  renderAttributes?: (
    context: StateMap & DispatchMap,
  ) => AllHTMLAttributes<Element>;
};

export type Props<As extends Tag> = WithIntrinsicElements<_Props<As>, As>;

function _DisclosureContent<As extends Tag>(
  { as, renderAttributes, ...props }: Props<As>,
  ref: Ref<Element>,
): JSX.Element {
  return WithDisclosureContent({
    children: (attrs, contexts) => {
      const tag = useAs(as, "div");
      const attributes = renderAttributes?.(contexts) ?? {};
      const root = createElement(tag, { ref });

      return cloneElement(
        root,
        mergeProps(mergeProps(attrs, props), attributes),
      );
    },
  });
}

const DisclosureContent = _forwardRef(_DisclosureContent);
export default DisclosureContent;

declare module "react" {
  // deno-lint-ignore ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: Ref<T>) => ReactElement | null,
  ): (props: P & RefAttributes<T>) => ReactElement | null;
}
