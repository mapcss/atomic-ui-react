// This module is browser compatible.

import {
  cloneElement,
  createElement,
  Fragment,
  ReactElement,
  useContext,
  useMemo,
} from "react";
import { joinChars } from "../util.ts";
import useTabPanelAria, {
  ReturnValue as UseTabPanelAriaReturnValue,
} from "./use_tab_panel_aria.ts";
import {
  DisabledIdsContext,
  IdContext,
  IndexContext,
  TabPanelCountContext,
} from "./context.ts";
import { PANEL, TAB } from "./constant.ts";

export type RenderContext = {
  selectedIndex: number;
  index: number;
  isDisabled: boolean;
  isSelected: boolean;
  isShowable: boolean;
};

export type Render = (
  root: ReactElement,
  attributes: UseTabPanelAriaReturnValue,
  context: RenderContext,
) => ReactElement;

export const defaultRender: Render = (
  root,
  attrs: UseTabPanelAriaReturnValue,
  { isShowable }: RenderContext,
) => {
  return isShowable ? cloneElement(root, attrs) : createElement(Fragment);
};

export type Props = {
  children: ReactElement;

  render?: Render;
};
export default function WithTabPanel(
  { children, render = defaultRender }: Props,
): JSX.Element {
  const id = useContext(IdContext);
  const tabPanelCount = useContext(TabPanelCountContext);
  const [selectedIndex] = useContext(IndexContext);
  const disabledIds = useContext(DisabledIdsContext);

  const index = tabPanelCount.current;
  const isDisabled = disabledIds.includes(index);
  const isSelected = useMemo<boolean>(() => index === selectedIndex, [
    selectedIndex,
  ]);
  const isShowable = useMemo<boolean>(() => isSelected && !isDisabled, [
    isSelected,
    isDisabled,
  ]);
  const tabId = joinChars([id, TAB, index], "-");
  const tabPanelId = joinChars([id, TAB, PANEL, index], "-");
  const aria = useTabPanelAria({ tabId, tabPanelId });

  return render(children, aria, {
    selectedIndex,
    index,
    isDisabled,
    isSelected,
    isShowable,
  });
}
