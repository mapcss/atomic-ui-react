import {
  cloneElement,
  createElement,
  Fragment,
  ReactNode,
  useCallback,
} from "react";
import { visit } from "./traverse.ts";

export type Props = {
  selectedIndex: number;

  defaultIndex?: number;

  onChange?: (index: number) => void;

  children: ReactNode;
};

export default function TabProvider(
  { children, defaultIndex = 0, selectedIndex, onChange }: Props,
): JSX.Element {
  const makeChildren = () => {
    let tabId = defaultIndex;
    let tabPanelId = defaultIndex;
    const newChildren = visit(children, {
      tab: (tabEl) => {
        const currentIndex = tabId;
        tabId++;
        const onClick = useCallback(() => {
          tabEl.props?.onClick?.();
          onChange?.(currentIndex);
        }, []);

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
    return newChildren;
  };

  return createElement(Fragment, null, makeChildren());
}
