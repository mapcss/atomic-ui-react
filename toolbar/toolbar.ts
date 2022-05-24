import { createElement, forwardRef as _forwardRef, Ref } from "react";
import { Tag, WithIntrinsicElements } from "../types.ts";
import WithToolbar from "./with_toolbar.ts";
import { useAs } from "../_shared/hooks.ts";

type _Props<As extends Tag> = {
  /**
   * @default `div`
   */
  as?: As;
};

export type Props<As extends Tag> = WithIntrinsicElements<_Props<As>, As>;

function _Toolbar<As extends Tag = "div">(
  { as, ...props }: Props<As>,
  ref: Ref<HTMLElement | SVGElement>,
): JSX.Element {
  return WithToolbar({
    children: (attributes) => {
      const tag = useAs(as, "div");

      return createElement(tag, { ref, ...attributes, ...props });
    },
  });
}

const Toolbar = _forwardRef(_Toolbar);

export default Toolbar;

declare module "react" {
  // deno-lint-ignore ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: Ref<T>) => ReactElement | null,
  ): (props: P & RefAttributes<T>) => ReactElement | null;
}
