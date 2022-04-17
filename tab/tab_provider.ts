// This module is browser compatible.

import {
  cloneElement,
  createElement,
  createRef,
  Fragment,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { isNumber, joinChars } from "../deps.ts";
import { Props as TabProps } from "./tab.ts";
import { Props as TabPanelProps } from "./tab_panel.ts";
import { Props as TabListProps } from "./tab_list.ts";
import { visit } from "./traverse.ts";
import { isAriaDisabled } from "./assert.ts";
import { DEFAULT_INDEX, TAB_PANEL_PREFIX, TAB_PREFIX } from "./constant.ts";
import {
  getFirstIndex,
  getLastIndex,
  getNextIndex,
  getPrevIndex,
} from "./util.ts";
import useId from "../hooks/use_id.ts";

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
  props: Props,
): JSX.Element {
  const {
    children,
    defaultIndex = DEFAULT_INDEX,
    selectedIndex,
    isHorizontal = true,
    onChange,
  } = props;
  const id = useId();
  const refs = useRef<RefObject<HTMLElement>[]>([]);
  refs.current.length = 0;

  let tabId = 0;
  let tabPanelId = 0;

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

  useEffect(() => {
    refs.current[index].current?.focus();
  }, [index]);

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

        if (isAriaDisabled(refs.current[currentIndex].current)) return;
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

      const ref = createRef<HTMLElement>();
      refs.current.push(ref);
      const props: TabProps = {
        id: joinChars([id, TAB_PREFIX, currentIndex], "-"),
        tabPanelId: joinChars([id, TAB_PANEL_PREFIX, currentIndex], "-"),
        onClick,
        onKeyDown,
        tabRef: ref,
        isSelected: currentIndex === index,
      };
      return cloneElement(tabEl, props);
    },
    tabPanel: (tabEl) => {
      const currentIndex = tabPanelId;
      tabPanelId++;

      if (currentIndex === index) {
        const props: TabPanelProps = {
          id: joinChars([id, TAB_PREFIX, currentIndex], "-"),
          tabId: joinChars([id, TAB_PANEL_PREFIX, currentIndex], "-"),
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
