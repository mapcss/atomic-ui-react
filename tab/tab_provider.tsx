// This module is browser compatible.

import {
  cloneElement,
  createElement,
  Fragment,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  useMemo,
  useState,
} from "react";
import { isNumber } from "../deps.ts";
import useIsFirstMount from "../hooks/use_is_first_mount.ts";
import { Props as TabProps } from "./tab.tsx";
import { Props as TabPanelProps } from "./tab_panel.tsx";
import { Props as TabListProps } from "./tab_list.tsx";
import { visit } from "./traverse.ts";
import {
  DEFAULT_INDEX,
  TAB_ID_PREFIX,
  TAB_PANEL_ID_PREFIX,
} from "./constant.ts";
import {
  getFirstIndex,
  getLastIndex,
  getNextIndex,
  getPrevIndex,
} from "./util.ts";

export type Props = {
  /** The selected index if you want to use as a controlled component. */
  selectedIndex?: number;

  /** The default selected index.
   * @default 0
   */
  defaultIndex?: number;

  /** A function called whenever the active tab will change. */
  onChange?: (index: number) => void;

  /** When `true`, the orientation of the `TabList` will be `horizontal`, otherwise `vertical`
   * @default true
   */
  isHorizontal?: boolean;

  children: ReactNode;
};

export default function TabProvider(
  {
    children,
    defaultIndex = DEFAULT_INDEX,
    selectedIndex,
    isHorizontal = true,
    onChange,
  }: Props,
): JSX.Element {
  let tabId = 0;
  let tabPanelId = 0;

  const { isFirstMount } = useIsFirstMount();
  const isControl = useMemo<boolean>(() => isNumber(selectedIndex), [
    selectedIndex,
  ]);
  const [state, setState] = useState<number>(selectedIndex ?? defaultIndex);

  const arrowLeftUp = useMemo<"ArrowLeft" | "ArrowUp">(
    () => isHorizontal ? "ArrowLeft" : "ArrowUp",
    [isHorizontal],
  );
  const arrowRightDown = useMemo<"ArrowRight" | "ArrowDown">(
    () => isHorizontal ? "ArrowRight" : "ArrowDown",
    [isHorizontal],
  );

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

      const updateState = (index: number): void => {
        onChange?.(index);
        if (!isControl) {
          setState(index);
        }
      };

      const onClick: MouseEventHandler = (ev) => {
        tabEl.props?.onClick?.(ev);

        if (currentIndex === index) return;
        updateState(currentIndex);
      };

      const onKeyDown: KeyboardEventHandler = (ev) => {
        tabEl.props?.onKeyDown?.(ev);

        switch (ev.code) {
          case arrowLeftUp: {
            const prevIndex = getPrevIndex(currentIndex, tabId);
            updateState(prevIndex);
            break;
          }
          case arrowRightDown: {
            const nextIndex = getNextIndex(currentIndex, tabId);
            updateState(nextIndex);
            break;
          }
          case "Home":
          case "PageUp": {
            const firstIndex = getFirstIndex();
            updateState(firstIndex);
            break;
          }
          case "End":
          case "PageDown": {
            const lastIndex = getLastIndex(currentIndex, tabId);
            updateState(lastIndex);
            break;
          }
        }
      };

      const props: TabProps = {
        id: `${TAB_ID_PREFIX}${currentIndex}`,
        tabPanelId: `${TAB_PANEL_ID_PREFIX}${currentIndex}`,
        onClick,
        onKeyDown,
        focus: !isFirstMount && currentIndex === index,
        isSelected: currentIndex === index,
      };
      return cloneElement(tabEl, props);
    },
    tabPanel: (tabEl) => {
      const currentIndex = tabPanelId;
      tabPanelId++;

      if (currentIndex === index) {
        const props: TabPanelProps = {
          id: `${TAB_PANEL_ID_PREFIX}${currentIndex}`,
          tabId: `${TAB_ID_PREFIX}${currentIndex}`,
        };
        return cloneElement(tabEl, props);
      }
    },
    tabList: (tabEl) => {
      const props: TabListProps = {
        isHorizontal,
      };
      return cloneElement(tabEl, props);
    },
  });

  return createElement(Fragment, null, newChildren);
}
