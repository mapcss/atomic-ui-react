import {
  createElement,
  forwardRef as _forwardRef,
  ReactNode,
  Ref,
  useContext,
  useMemo,
} from "react";
import WithAccordionHeader from "./with_accordion_header.ts";
import { Tag, WithIntrinsicElements } from "../types.ts";
import { Options } from "./use_accordion_header.ts";
import { CommonContextsContext, IdContext } from "./context.ts";
import { useId } from "../hooks/mod.ts";
import { joinChars } from "../util.ts";

type _Props<As extends Tag> = {
  /**
   * @default `button`
   */
  as?: As;

  children?: ReactNode;
} & Partial<Options>;

export type Props<As extends Tag> = WithIntrinsicElements<_Props<As>, As>;

function _AccordionHeader<As extends Tag = "button">(
  { as = "button" as As, children }: Readonly<
    Props<As>
  >,
  ref: Ref<Element>,
): JSX.Element | never {
  const groupId = useContext(IdContext);
  const commonContexts = useContext(CommonContextsContext);

  if (!groupId || !commonContexts) throw Error();

  const prefix = useMemo<string>(
    () => joinChars([groupId, "accordion", "header"], "-")!,
    [groupId],
  );

  const { id, index } = useId({
    prefix,
  });

  const panelId = useMemo<string>(
    () => joinChars([groupId, "accordion", "panel", index], "-")!,
    [groupId, index],
  );
  const { openIndex, setOpenIndex } = commonContexts;

  return WithAccordionHeader({
    children: (attrs) => {
      return createElement(as, {
        ref,
        ...attrs,
      }, children);
    },
    id,
    index,
    openIndex,
    setOpenIndex,
    panelId,
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
