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
import { useAs } from "../_shared/hooks.ts";

type _Props<As extends Tag> = {
  /**
   * @default `button`
   */
  as?: As;

  children?: ReactNode;
} & Omit<WithToolbarItemProps, "children">;

export type Props<As extends Tag> = WithIntrinsicElements<_Props<As>, As>;

function _ToolbarItem<As extends Tag = "button">(
  { as, children, ...rest }: Props<As>,
  _: Ref<HTMLElement | SVGElement>,
): JSX.Element {
  return WithToolbarItem({
    children: (attributes) => {
      const tag = useAs(as, "button");

      return createElement(
        tag,
        attributes,
        children,
      );
    },
    ...rest,
  });
}

const ToolbarItem = _forwardRef(_ToolbarItem);

export default ToolbarItem;

declare module "react" {
  // deno-lint-ignore ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: Ref<T>) => ReactElement | null,
  ): (props: P & RefAttributes<T>) => ReactElement | null;
}
