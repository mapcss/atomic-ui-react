import {
  AllHTMLAttributes,
  createElement,
  forwardRef as _forwardRef,
  Ref,
  useMemo,
} from "react";
import WithAccordionPanel from "./with_accordion_panel.ts";
import { useAs } from "../_shared/hooks.ts";
import { mergeProps } from "../util.ts";
import { Tag, WithIntrinsicElements } from "../types.ts";
import { Contexts } from "./use_accordion_panel.ts";

type _Props<As extends Tag> = {
  as?: As;

  renderAttributes?: (contexts: Contexts) => AllHTMLAttributes<Element>;
};

export type Props<As extends Tag> = WithIntrinsicElements<_Props<As>, As>;

function _AccordionPanel<As extends Tag>(
  { as, renderAttributes, ...props }: Readonly<Props<As>>,
  ref: Ref<Element>,
): JSX.Element {
  return WithAccordionPanel({
    children: (attrs, contexts) => {
      const tag = useAs(as, "div");
      const attributes = useMemo<AllHTMLAttributes<Element>>(
        () => renderAttributes?.(contexts) ?? {},
        [renderAttributes, JSON.stringify(contexts)],
      );

      return createElement(tag, {
        ref,
        ...mergeProps(attrs, mergeProps(props, attributes)),
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
