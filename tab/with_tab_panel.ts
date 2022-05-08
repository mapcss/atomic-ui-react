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
function _WithTabPanel<T>(
  { children }: Props,
  ref: Ref<T>,
): JSX.Element {
  const id = useContext(IdContext);
  const tabPanelCount = useContext(TabPanelCountContext);
  const [index] = useContext(IndexContext);
  const currentIndex = tabPanelCount.current;
  const tabId = joinChars([id, "tab", currentIndex], "-");
  const _id = joinChars([id, "tab", "panel", currentIndex], "-");
  const aria = useTabPanelAria({ tabId });

  return index === currentIndex
    ? cloneElement(children, { ref, ...aria, id: _id })
    : createElement(Fragment);
}

const WithTabPanel = forwardRef(_WithTabPanel);

export default WithTabPanel;
