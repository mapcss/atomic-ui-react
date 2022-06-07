import { createElement, PropsWithChildren, useContext, useMemo } from "react";
import { CommonContextsContext, GroupIdContext } from "./contexts.ts";
import WithMenuButton from "./with_menu_button.ts";
import { joinChars } from "../util.ts";
import { Tag } from "../types.ts";

export type Props<As extends Tag> = PropsWithChildren<{
  /**
   * @default `button`
   */
  as?: As;
}>;

export default function MenuButton<As extends Tag = "button">(
  { children, as = "button" as As }: Props<Tag>,
): JSX.Element | never {
  const commonContexts = useContext(CommonContextsContext);
  const groupId = useContext(GroupIdContext);

  if (!commonContexts || !groupId) throw Error("");

  const id = useMemo<string>(
    () => joinChars([groupId, "menu", "button"], "-")!,
    [groupId],
  );

  return createElement(WithMenuButton, {
    children: (attrs) => {
      return createElement(as, attrs, children);
    },
    contexts: {
      ...commonContexts,
      id,
      menuId: groupId,
    },
    ref: commonContexts.menuTriggerRef,
  });
}
