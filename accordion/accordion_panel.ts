import {
  createElement,
  forwardRef as _forwardRef,
  ReactNode,
  Ref,
  useContext,
  useMemo,
} from "react";
import WithAccordionPanel from "./with_accordion_panel.ts";
import { AttributesWithContexts, Params } from "./use_accordion_panel.ts";
import { Tag, WithIntrinsicElements } from "../types.ts";
import { CommonContextsContext, IdContext } from "./context.ts";
import { joinChars } from "../util.ts";
import { useId } from "../hooks/mod.ts";

type _Props<As extends Tag> = {
  /**
   * @default `div`
   */
  as?: As;

  children?: ReactNode;
} & Partial<AttributesWithContexts>;

export type Props<As extends Tag> = WithIntrinsicElements<_Props<As>, As>;

function _AccordionPanel<As extends Tag>(
  { as = "div" as As, children, ...allAttributes }: Readonly<Props<As>>,
  ref: Ref<Element>,
): JSX.Element {
  const groupId = useContext(IdContext);
  const commonContexts = useContext(CommonContextsContext);

  if (!groupId || !commonContexts) throw Error();
  const { openIndex, setOpenIndex } = commonContexts;

  const prefix = useMemo<string>(
    () => joinChars([groupId, "accordion", "panel"], "-")!,
    [groupId],
  );

  const { id, index } = useId({
    prefix,
  });

  const headerId = useMemo<string>(
    () => joinChars([groupId, "accordion", "header", index], "-")!,
    [groupId, index],
  );

  const contexts = useMemo<Params>(() => ({
    openIndex,
    setOpenIndex,
    id,
    index,
    headerId,
  }), [openIndex, setOpenIndex, id, index, headerId]);

  return WithAccordionPanel({
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

const AccordionPanel = _forwardRef(_AccordionPanel);
export default AccordionPanel;
