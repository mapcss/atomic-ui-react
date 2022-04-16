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
import { visit } from "./traverse.ts";
import {
  DEFAULT_INDEX,
  TAB_ID_PREFIX,
  TAB_PANEL_ID_PREFIX,
} from "./constant.ts";

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

  const { isFirstMount } = useIsFirstMount();
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

      const onClick: MouseEventHandler = (ev) => {
        tabEl.props?.onClick?.(ev);

        if (currentIndex === index) return;
        onChange?.(currentIndex);
        if (!isControl) {
          setState(currentIndex);
        }
      };

      const onKeyDown: KeyboardEventHandler = (ev) => {
        switch (ev.code) {
          case "ArrowLeft": {
            const prevIndex = getPrevIndex(currentIndex, tabId);

            onChange?.(prevIndex);
            if (!isControl) {
              setState(prevIndex);
            }
            break;
          }
          case "ArrowRight": {
            const nextIndex = getNextIndex(currentIndex, tabId);
            onChange?.(nextIndex);
            if (!isControl) {
              setState(nextIndex);
            }
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
  });

  return createElement(Fragment, null, newChildren);
}

function getNextIndex(currentIndex: number, wholeCount: number): number {
  const _next = currentIndex + 1;

  if (_next < wholeCount) {
    return _next;
  }
  return 0;
}

function getPrevIndex(currentIndex: number, wholeCount: number): number {
  const _prev = currentIndex - 1;
  if (0 <= _prev) {
    return _prev;
  }
  return wholeCount - 1;
}
