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
import WithDisclosureContent, {
  defaultRender,
} from "./with_disclosure_content.ts";
import { DispatchMap, StateMap } from "./types.ts";
import { WithIntrinsicElements } from "../types.ts";

type _Props<As extends Tag> = {
  as?: As;

  propsAs?: (context: StateMap & DispatchMap) => AllHTMLAttributes<Element>;
};

export type Props<As extends Tag> = WithIntrinsicElements<_Props<As>, As>;

function _DisclosureContent<As extends Tag>(
  { as, propsAs, ...props }: Props<As>,
  ref: Ref<Element>,
): JSX.Element {
  return WithDisclosureContent({
    children: (attrs, context) => {
      const tag = useAs(as, "div");
      const propsWith = propsAs?.(context) ?? {};

      const root = createElement(tag, { ref });
      const rendered = defaultRender(root, attrs, context);

      return cloneElement(rendered, mergeProps(props, propsWith));
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
