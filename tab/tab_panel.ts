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
import { IdContext, IndexContext, TabPanelCountContext } from "./context.ts";

export type Props = {
  children: ReactElement;
};
function _TabPanel<T>(
  { children }: Props,
  ref: Ref<T>,
): JSX.Element {
  const id = useContext(IdContext);
  const tabPanelCountRef = useContext(TabPanelCountContext);
  const [index] = useContext(IndexContext);
  const currentIndex = tabPanelCountRef.current;
  const tabId = joinChars([id, currentIndex], "-");
  const aria = useTabPanelAria({ tabId });

  return index === currentIndex
    ? cloneElement(children, { ref, ...aria })
    : createElement(Fragment);
}

const TabPanel = forwardRef(_TabPanel);

export default TabPanel;
