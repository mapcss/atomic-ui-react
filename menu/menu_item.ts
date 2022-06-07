import {
  createElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import WithMenuitem from "./with_menu_item.ts";
import { Tag } from "../types.ts";
import { CommonContextsContext, GroupIdContext } from "./contexts.ts";
import { ExclusiveActiveIndexProps } from "../_shared/types.ts";
import { useId } from "../hooks/mod.ts";
import { FocusStrategyContext } from "../focus/mod.ts";
import { joinChars } from "../util.ts";
export type Props<As extends Tag> = {
  /**
   * @default `ul`
   */
  as?: As;

  children?: ReactNode;
} & ExclusiveActiveIndexProps;
export default function MenuItem<As extends Tag = "li">(
  {
    children,
    as = "li" as As,
  }: Readonly<Props<As>>,
): JSX.Element | never {
  const commonContexts = useContext(CommonContextsContext);
  const groupId = useContext(GroupIdContext);

  if (!commonContexts || !groupId) throw Error("");
  const prefix = useMemo<string>(
    () => joinChars([groupId, "menu", "item"], "-")!,
    [
      groupId,
    ],
  );
  const { id, index } = useId({ prefix });
  const ref = useRef<Element>(null);

  useEffect(() => {
    commonContexts.menuItemsRef.current.push(ref);
  }, []);

  const focusStrategy = useContext(FocusStrategyContext);

  return createElement(WithMenuitem, {
    children: (attrs) => {
      return createElement(as, attrs, children);
    },
    ref,
    contexts: { id, index, focusStrategy, ...commonContexts },
  });
}
