// This module is browser compatible.

import { createElement, forwardRef as _forwardRef, Ref } from "react";
import { Tag } from "../types.ts";
import { useAs } from "../_shared/hooks.ts";
import WithDisclosureContent, {
  Props as WithDisclosureProps,
} from "./with_disclosure_content.ts";
import { WithIntrinsicElements } from "../types.ts";

type _Props<As extends Tag> = {
  as?: As;
} & Omit<WithDisclosureProps, "children">;

export type Props<As extends Tag> = WithIntrinsicElements<_Props<As>, As>;

function _DisclosureContent<As extends Tag = "div">(
  { as, children, ...props }: Props<As>,
  ref: Ref<Element>,
): JSX.Element {
  return WithDisclosureContent({
    children: (attrs) => {
      const tag = useAs(as, "div");

      return createElement(tag, { ref, ...attrs, children });
    },
    ...props,
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
