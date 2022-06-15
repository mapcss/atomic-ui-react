import { createElement, forwardRef as _forwardRef, Ref } from "react";
import { Tag, WithIntrinsicElements } from "../types.ts";
import WithToolbar from "./with_toolbar.ts";

type _Props<As extends Tag> = {
  /**
   * @default `div`
   */
  as?: As;
};

export type Props<As extends Tag> = WithIntrinsicElements<_Props<As>, As>;

function _Toolbar<As extends Tag = "div">(
  { as = "div" as As, ...props }: Props<As>,
  ref: Ref<HTMLElement | SVGElement>,
): JSX.Element {
  return WithToolbar({
    children: (attributes) => {
      return createElement(as, { ref, ...attributes, ...props });
    },
  });
}

const Toolbar = _forwardRef(_Toolbar);

export default Toolbar;
