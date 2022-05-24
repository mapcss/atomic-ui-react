import {
  AllHTMLAttributes,
  createElement,
  forwardRef as _forwardRef,
  Ref,
  useMemo,
} from "react";
import WithAccordionHeader from "./with_accordion_header.ts";
import { mergeProps } from "../util.ts";
import { useAs } from "../_shared/hooks.ts";
import { Tag, WithIntrinsicElements } from "../types.ts";
import { Contexts, Options } from "./use_accordion_header.ts";

type _Props<As extends Tag> = {
  /**
   * @default `button`
   */
  as?: As;

  renderAttributes?: (contexts: Contexts) => AllHTMLAttributes<Element>;
} & Partial<Options>;

export type Props<As extends Tag> = WithIntrinsicElements<_Props<As>, As>;

function _AccordionHeader<As extends Tag = "button">(
  { as, on, onKey, keyEntries, renderAttributes, ...props }: Readonly<
    Props<As>
  >,
  ref: Ref<Element>,
): JSX.Element {
  return WithAccordionHeader({
    children: (attrs, context) => {
      const tag = useAs(as, "button");
      const attributes = useMemo<AllHTMLAttributes<Element>>(
        () => renderAttributes?.(context) ?? {},
        [renderAttributes, JSON.stringify(context)],
      );
      return createElement(tag, {
        ref,
        ...mergeProps(attrs, mergeProps(props, attributes)),
      });
    },
    onKey,
    on,
    keyEntries,
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
