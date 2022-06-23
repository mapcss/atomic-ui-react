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
import { AttributesWithContexts, Params } from "./use_accordion_header.ts";
import { CommonContextsContext, IdContext } from "./context.ts";
import { useId } from "../hooks/mod.ts";
import { joinChars } from "../util.ts";

type _Props<As extends Tag> = {
  /**
   * @default `button`
   */
  as?: As;

  children?: ReactNode;
} & Partial<AttributesWithContexts>;

export type Props<As extends Tag> = WithIntrinsicElements<_Props<As>, As>;

function _AccordionHeader<As extends Tag = "button">(
  { as = "button" as As, children, ...allAttributes }: Readonly<Props<As>>,
  ref: Ref<Element>,
): JSX.Element | never {
  const groupId = useContext(IdContext);
  const commonContexts = useContext(CommonContextsContext);

  if (!groupId || !commonContexts) throw Error();

  const prefix = useMemo<string>(
    () => joinChars([groupId, "accordion", "header"], "-")!,
    [groupId],
  );

  const { id, index } = useId({ prefix });

  const panelId = useMemo<string>(
    () => joinChars([groupId, "accordion", "panel", index], "-")!,
    [groupId, index],
  );

  const contexts = useMemo<Params>(() => ({
    ...commonContexts,
    index,
    id,
    panelId,
  }), [commonContexts, index, id, panelId]);

  return WithAccordionHeader({
    children: (attrs) => {
      return createElement(as, {
        ref,
        ...attrs,
      }, children);
    },
    contexts,
    ...allAttributes,
  });
}

const AccordionHeader = _forwardRef(_AccordionHeader);
export default AccordionHeader;
