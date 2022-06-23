import {
  createElement,
  forwardRef as _forwardRef,
  ReactNode,
  Ref,
} from "react";
import { Tag, WithIntrinsicElements } from "../types.ts";
import WithToolbarItem, {
  Props as WithToolbarItemProps,
} from "./with_toolbar_item.ts";

type _Props<As extends Tag> = {
  /**
   * @default `button`
   */
  as?: As;

  children?: ReactNode;
} & Omit<WithToolbarItemProps, "children">;

export type Props<As extends Tag> = WithIntrinsicElements<_Props<As>, As>;

function _ToolbarItem<As extends Tag = "button">(
  { as = "button" as As, children, ...rest }: Props<As>,
  _: Ref<HTMLElement | SVGElement>,
): JSX.Element {
  return WithToolbarItem({
    children: (attributes) => {
      return createElement(
        as,
        attributes,
        children,
      );
    },
    ...rest,
  });
}

const ToolbarItem = _forwardRef(_ToolbarItem);

export default ToolbarItem;
