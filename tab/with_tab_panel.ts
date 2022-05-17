// This module is browser compatible.

import {
  AllHTMLAttributes,
  cloneElement,
  ReactElement,
  useContext,
  useMemo,
} from "react";
import { isFunction } from "../deps.ts";
import { joinChars } from "../util.ts";
import useTabPanelAria from "./use_tab_panel_aria.ts";
import {
  DisabledIdsContext,
  IdContext,
  IndexContext,
  TabPanelCountContext,
} from "./context.ts";
import { PANEL, TAB } from "./constant.ts";

export type Context = {
  selectedIndex: number;
  index: number;
  isDisabled: boolean;
  isSelected: boolean;
  isShowable: boolean;
};

export type Attributes = Pick<
  AllHTMLAttributes<Element>,
  "hidden" | "aria-labelledby" | "role" | "id"
>;

export type Props = {
  children:
    | ReactElement
    | ((attributes: Attributes, context: Context) => ReactElement);
};
export default function WithTabPanel(
  { children }: Props,
): JSX.Element {
  const id = useContext(IdContext);
  const tabPanelCount = useContext(TabPanelCountContext);
  const [selectedIndex] = useContext(IndexContext);
  const disabledIds = useContext(DisabledIdsContext);

  const index = tabPanelCount.next;
  const isDisabled = disabledIds.includes(index);
  const isSelected = useMemo<boolean>(() => index === selectedIndex, [
    selectedIndex,
  ]);
  const isShowable = useMemo<boolean>(() => isSelected && !isDisabled, [
    isSelected,
    isDisabled,
  ]);
  const tabId = useMemo<string | undefined>(
    () => joinChars([id, TAB, index], "-"),
    [id, index],
  );
  const tabPanelId = useMemo<string | undefined>(
    () => joinChars([id, TAB, PANEL, index], "-"),
    [id, index],
  );
  const aria = useTabPanelAria({ tabId, tabPanelId });

  const attributes = useMemo<Attributes>(() => ({
    hidden: !isShowable,
    ...aria,
  }), [JSON.stringify(aria)]);

  const context = useMemo<Context>(() => ({
    isSelected,
    isShowable,
    isDisabled,
    selectedIndex,
    index,
  }), [isSelected, isShowable, isDisabled, selectedIndex, index]);

  if (isFunction(children)) {
    return children(attributes, context);
  }

  return cloneElement(children, attributes);
}
