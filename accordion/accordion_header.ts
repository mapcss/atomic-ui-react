import {
  AllHTMLAttributes,
  createElement,
  forwardRef as _forwardRef,
  Ref,
  useMemo,
} from "react";
import WithAccordionHeader, {
  Props as WithAccordionHeaderProps,
} from "./with_accordion_header.ts";
import { mergeProps } from "../util.ts";
import { useAs } from "../_shared/hooks.ts";
import { Tag, WithIntrinsicElements } from "../types.ts";
import { Context } from "./types.ts";

type _Props<As extends Tag> = {
  /**
   * @default `button`
   */
  as?: As;

  propsAs?: (context: Context) => AllHTMLAttributes<Element>;
} & Pick<WithAccordionHeaderProps, "on" | "onKey">;

export type Props<As extends Tag> = WithIntrinsicElements<_Props<As>, As>;

function _AccordionHeader<As extends Tag = "button">(
  { as, on, onKey, propsAs, ...props }: Props<As>,
  ref: Ref<Element>,
): JSX.Element {
  return WithAccordionHeader({
    children: (attributes, context) => {
      const tag = useAs(as, "button");
      const propsWith = useMemo<AllHTMLAttributes<Element>>(
        () => propsAs?.(context) ?? {},
        [propsAs, JSON.stringify(context)],
      );
      return createElement(tag, {
        ref,
        ...mergeProps(attributes, mergeProps(props, propsWith)),
      });
    },
    onKey,
    on,
  });
}

const AccordionHeader = _forwardRef(_AccordionHeader);
export default AccordionHeader;

declare module "react" {
  // deno-lint-ignore ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: Ref<T>) => ReactElement | null,
  ): (props: P & RefAttributes<T>) => ReactElement | null;
}
