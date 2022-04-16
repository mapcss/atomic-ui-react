import {
  cloneElement,
  createElement,
  Fragment,
  ReactNode,
  useCallback,
  useState,
} from "react";
import { visit } from "./traverse.ts";

const defaultIndex = 0;

export default function TabProvider(
  { children }: { children: ReactNode },
): JSX.Element {
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

  const makeChildren = () => {
    let tabId = defaultIndex;
    let tabPanelId = defaultIndex;
    const newChildren = visit(children, {
      tab: (tabEl) => {
        const currentIndex = tabId;
        tabId++;
        const onClick = useCallback(() => {
          tabEl.props?.onClick?.();
          setSelectedIndex(currentIndex);
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
