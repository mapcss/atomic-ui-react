import {
  cloneElement,
  createElement,
  Fragment,
  MouseEventHandler,
  ReactNode,
  useMemo,
  useState,
} from "react";
import { visit } from "./traverse.ts";
import { DEFAULT_INDEX } from "./constant.ts";
import { isNumber } from "../deps.ts";

export type Props = {
  /** The selected index if you want to use as a controlled component. */
  selectedIndex?: number;

  /** The default selected index.
   * @default 0
   */
  defaultIndex?: number;

  /** A function called whenever the active tab will change. */
  onChange?: (index: number) => void;

  children: ReactNode;
};

export default function TabProvider(
  { children, defaultIndex = DEFAULT_INDEX, selectedIndex, onChange }: Props,
): JSX.Element {
  let tabId = 0;
  let tabPanelId = 0;

  const isControl = useMemo<boolean>(() => isNumber(selectedIndex), [
    selectedIndex,
  ]);
  const [state, setState] = useState<number>(selectedIndex ?? defaultIndex);

  const index = useMemo<number>(
    () => isControl ? selectedIndex ?? defaultIndex : state,
    [
      isControl,
      selectedIndex,
      state,
      defaultIndex,
    ],
  );

  const newChildren = visit(children, {
    tab: (tabEl) => {
      const currentIndex = tabId;
      tabId++;

      const onClick: MouseEventHandler = (ev): void => {
        tabEl.props?.onClick?.(ev);

        if (currentIndex === index) return;
        onChange?.(currentIndex);
        if (!isControl) {
          setState(currentIndex);
        }
      };

      const props = {
        id: `tab-${currentIndex}`,
        onClick,
        isSelect: currentIndex === index,
      };
      return cloneElement(tabEl, props);
    },
    tabPanel: (tabEl) => {
      const currentIndex = tabPanelId;
      tabPanelId++;

      if (currentIndex === index) {
        const props = { id: currentIndex };
        return cloneElement(tabEl, props);
      }
    },
  });

  return createElement(Fragment, null, newChildren);
}
