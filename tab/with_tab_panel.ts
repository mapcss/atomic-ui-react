// This module is browser compatible.

import {
  cloneElement,
  createElement,
  forwardRef,
  Fragment,
  ReactElement,
  Ref,
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
export type RenderAttributes<E extends Element = Element> = {
  ref: Ref<E>;
} & UseTabPanelAriaReturnValue;

export type Render<E extends Element = Element> = (
  root: ReactElement,
  attributes: RenderAttributes<E>,
  context: RenderContext,
) => ReactElement;

export const defaultRender: Render = (
  root,
  attrs: RenderAttributes,
  { isShowable }: RenderContext,
) => {
  return isShowable ? cloneElement(root, attrs) : createElement(Fragment);
};

export type Props = {
  children: ReactElement;

  render?: Render;
};
function _WithTabPanel<T extends Element = Element>(
  { children, render = defaultRender }: Props,
  ref: Ref<T>,
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

  return render(children, { ref, ...aria }, {
    selectedIndex,
    index,
    isDisabled,
    isSelected,
    isShowable,
  });
}

const WithTabPanel = forwardRef(_WithTabPanel);

export default WithTabPanel;
