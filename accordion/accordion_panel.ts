import {
  createElement,
  forwardRef as _forwardRef,
  ReactNode,
  Ref,
  useContext,
  useMemo,
} from "react";
import WithAccordionPanel from "./with_accordion_panel.ts";
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
};

export type Props<As extends Tag> = WithIntrinsicElements<_Props<As>, As>;

function _AccordionPanel<As extends Tag>(
  { as = "div" as As, children }: Readonly<Props<As>>,
  ref: Ref<Element>,
): JSX.Element {
  const groupId = useContext(IdContext);
  const commonContexts = useContext(CommonContextsContext);

  if (!groupId || !commonContexts) throw Error();

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
  const { openIndex, setOpenIndex } = commonContexts;

  return WithAccordionPanel({
    children: (attrs) => {
      return createElement(as, {
        ref,
        ...attrs,
      }, children);
    },
    id,
    index,
    headerId,
    openIndex,
    setOpenIndex,
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
