// This module is browser compatible.

import {
  cloneElement,
  createElement,
  forwardRef,
  Fragment,
  ReactElement,
  Ref,
  useContext,
} from "react";
import { joinChars } from "../util.ts";
import useTabPanelAria from "./use_tab_panel_aria.ts";
import {
  DisabledIdsContext,
  IdContext,
  IndexContext,
  TabPanelCountContext,
} from "./context.ts";
import { PANEL, TAB } from "./constant.ts";

export type Props = {
  children: ReactElement;
};
function _WithTabPanel<T>(
  { children }: Props,
  ref: Ref<T>,
): JSX.Element {
  const id = useContext(IdContext);
  const tabPanelCount = useContext(TabPanelCountContext);
  const [index] = useContext(IndexContext);
  const disabledIds = useContext(DisabledIdsContext);

  const currentIndex = tabPanelCount.current;
  const isDisabled = disabledIds.includes(currentIndex);
  const tabId = joinChars([id, TAB, currentIndex], "-");
  const tabPanelId = joinChars([id, TAB, PANEL, currentIndex], "-");
  const aria = useTabPanelAria({ tabId, tabPanelId });

  return index === currentIndex && !isDisabled
    ? cloneElement(children, { ref, ...aria })
    : createElement(Fragment);
}

const WithTabPanel = forwardRef(_WithTabPanel);

export default WithTabPanel;
