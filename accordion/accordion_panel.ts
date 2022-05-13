import {
  AllHTMLAttributes,
  createElement,
  forwardRef as _forwardRef,
  Ref,
  useMemo,
} from "react";
import WithAccordionPanel from "./with_accordion_panel.ts";
import { Context } from "./types.ts";
import { useAs } from "../_shared/hooks.ts";
import { mergeProps } from "../util.ts";
import { Tag, WithIntrinsicElements } from "../types.ts";

type _Props<As extends Tag> = {
  as?: As;

  propsAs?: (context: Context) => AllHTMLAttributes<Element>;
};

export type Props<As extends Tag> = WithIntrinsicElements<_Props<As>, As>;

function _AccordionPanel<As extends Tag>(
  { as, propsAs, ...props }: Props<As>,
  ref: Ref<Element>,
): JSX.Element {
  return WithAccordionPanel({
    children: (attributes, context) => {
      const tag = useAs(as, "div");
      const propsWith = useMemo<AllHTMLAttributes<Element>>(
        () => propsAs?.(context) ?? {},
        [propsAs, JSON.stringify(context)],
      );

      return createElement(tag, {
        ref,
        ...mergeProps(attributes, mergeProps(props, propsWith)),
      });
    },
  });
}

const AccordionPanel = _forwardRef(_AccordionPanel);
export default AccordionPanel;

declare module "react" {
  // deno-lint-ignore ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: Ref<T>) => ReactElement | null,
  ): (props: P & RefAttributes<T>) => ReactElement | null;
}
