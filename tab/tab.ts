import { createElement, ReactNode, useContext, useMemo } from "react";
import {
  CommonContextsContext,
  HorizontalContext,
  IdContext,
} from "./context.ts";
import { Tag } from "../types.ts";
import { FocusStrategyContext } from "../focus/mod.ts";
import { ERROR_MSG } from "./constant.ts";
import useTab, { AttributesWithContexts, Params } from "./use_tab.ts";
import { useId } from "../hooks/mod.ts";
import { joinChars } from "../util.ts";

export type Props<T extends Tag> = {
  /**
   * @default `button`
   */
  tag?: T;

  children?: ReactNode;
} & AttributesWithContexts;

export default function Tab<T extends Tag>(
  { tag = "button" as T, children, ...allAttributes }: Props<T>,
): JSX.Element | never {
  const groupId = useContext(IdContext);
  const isHorizontal = useContext(HorizontalContext);
  const commonContexts = useContext(CommonContextsContext);
  const focusStrategy = useContext(FocusStrategyContext);

  if (!groupId || !commonContexts) {
    throw Error(ERROR_MSG);
  }

  const prefix = useMemo<string>(() => joinChars([groupId, "tab"], "-")!, [
    groupId,
  ]);
  const { id, index } = useId({ prefix });

  const tabPanelId = useMemo<string>(
    () => joinChars([prefix, "panel", index], "-")!,
    [groupId, index],
  );

  const contexts = useMemo<Params>(() => ({
    id,
    index,
    tabPanelId,
    ...commonContexts,
  }), [id, index, tabPanelId, commonContexts]);

  const [attributes] = useTab(contexts, {
    isHorizontal,
    focusStrategy,
  }, allAttributes);

  return createElement(tag, attributes, children);
}
