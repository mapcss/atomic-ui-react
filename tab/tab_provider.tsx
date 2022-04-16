import {
  cloneElement,
  createElement,
  Fragment,
  MouseEventHandler,
  ReactNode,
} from "react";
import { visit } from "./traverse.ts";
import { DEFAULT_INDEX } from "./constant.ts";

export type Props = {
  selectedIndex: number;

  defaultIndex?: number;

  onChange?: (index: number) => void;

  children: ReactNode;
};

export default function TabProvider(
  { children, defaultIndex = DEFAULT_INDEX, selectedIndex, onChange }: Props,
): JSX.Element {
  let tabId = defaultIndex;
  let tabPanelId = defaultIndex;

  const newChildren = visit(children, {
    tab: (tabEl) => {
      const currentIndex = tabId;
      tabId++;

      const onClick: MouseEventHandler = (ev): void => {
        tabEl.props?.onClick?.(ev);
        onChange?.(currentIndex);
      };

      const props = {
        id: `tab-${currentIndex}`,
        onClick,
        isSelect: currentIndex === selectedIndex,
      };
      return cloneElement(tabEl, props);
    },
    tabPanel: (tabEl) => {
      const currentIndex = tabPanelId;
      tabPanelId++;

      if (currentIndex === selectedIndex) {
        const props = { id: currentIndex };
        return cloneElement(tabEl, props);
      }
    },
  });

  return createElement(Fragment, null, newChildren);
}
