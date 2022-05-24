import {
  ComponentProps,
  createElement,
  forwardRef as _forwardRef,
  Ref,
  useMemo,
} from "react";
import { Tag, WithIntrinsicElements } from "../types.ts";
import WithToolbarItem from "./with_toolbar_item.ts";
import { Contexts } from "./use_toolbar_item.ts";
import { useAs } from "../_shared/hooks.ts";
import { mergeProps } from "../util.ts";

type _Props<As extends Tag> = {
  /**
   * @default `button`
   */
  as?: As;

  propsAs?: (contexts: Contexts) => ComponentProps<As>;
};

export type Props<As extends Tag> = WithIntrinsicElements<_Props<As>, As>;

function _ToolbarItem<As extends Tag = "button">(
  { as, propsAs, ...rest }: Props<As>,
  _: Ref<HTMLElement | SVGElement>,
): JSX.Element {
  return WithToolbarItem({
    children: (attributes, contexts) => {
      const tag = useAs(as, "button");
      const _propsAs = useMemo(
        () => {
          return propsAs?.(contexts) ?? {};
        },
        [propsAs, JSON.stringify(contexts)],
      );

      const props = mergeProps(mergeProps(attributes, rest), _propsAs);

      return createElement(
        tag,
        props,
      );
    },
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
