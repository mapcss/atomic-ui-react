import { createElement, ReactNode, useContext, useMemo } from "react";
import WithMenu from "./with_menu.ts";
import { Tag } from "../types.ts";
import { CommonContextsContext, GroupIdContext } from "./contexts.ts";
import {
  FocusStrategyContext,
  FocusStrategyProps,
  RovingTabIndex,
} from "../focus/mod.ts";
import { ExclusiveActiveIndexProps } from "../_shared/types.ts";
import { joinChars } from "../util.ts";

export type Props<As extends Tag> =
  & {
    /**
     * @default `ul`
     */
    as?: As;

    children?: ReactNode;
  }
  & Partial<FocusStrategyProps>
  & ExclusiveActiveIndexProps;
export default function Menu<As extends Tag = "ul">(
  {
    children,
    as = "ul" as As,
    focusStrategy = RovingTabIndex,
  }: Readonly<Props<As>>,
): JSX.Element | never {
  const commonContexts = useContext(CommonContextsContext);
  const groupId = useContext(GroupIdContext);

  if (!commonContexts || !groupId) throw Error("ffff");

  const buttonId = useMemo<string>(
    () => joinChars([groupId, "menu", "button"], "-")!,
    [groupId],
  );

  return createElement(
    FocusStrategyContext.Provider,
    { value: focusStrategy },
    createElement(WithMenu, {
      children: (attrs) => {
        return createElement(as, attrs, children);
      },
      contexts: { ...commonContexts, focusStrategy, buttonId, id: groupId },
      ref: commonContexts.menuRef,
    }),
  );
}
