// This module is browser compatible.

import {
  AllHTMLAttributes,
  cloneElement,
  DOMAttributes,
  forwardRef,
  ReactElement,
  Ref,
  RefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import useTabAria, { Param } from "./use_tab_aria.ts";
import { isNumber } from "../deps.ts";
import { joinChars, mergeProps, resolveRefObject } from "../util.ts";
import {
  DisabledIdsContext,
  HorizontalContext,
  IdContext,
  IndexContext,
  TabCountContext,
  TabRefsContext,
} from "./context.ts";
import {
  getFirstIndex,
  getLastIndex,
  getNextIndex,
  getPrevIndex,
} from "./util.ts";
import { PANEL, TAB } from "./constant.ts";
import { isAriaDisabled } from "./assert.ts";

type KeyboardHandler = keyof Pick<
  DOMAttributes<Element>,
  "onKeyDown" | "onKeyUp"
>;

export type Props = {
  children: ReactElement;

  keyboardEvent?: KeyboardHandler | false;

  events?: (keyof Omit<
    DOMAttributes<Element>,
    "children" | "dangerouslySetInnerHTML" | KeyboardHandler
  >)[];
} & Partial<Pick<Param, "isDisabled">>;

function _WithTab<T extends HTMLElement>(
  {
    isDisabled,
    children,
    keyboardEvent = "onKeyDown",
    events = ["onClick"],
  }: Props,
  _ref: Ref<T>,
): JSX.Element {
  const id = useContext(IdContext);
  const [selectedIndex, setIndex] = useContext(IndexContext);
  const tabCount = useContext(TabCountContext);
  const refs = useContext(TabRefsContext);
  const isHorizontal = useContext(HorizontalContext);
  const disabledIds = useContext(DisabledIdsContext);
  const index = tabCount.current;
  const el = useRef<T>(null);
  const ref = resolveRefObject<T>(_ref) ?? el;
  if (isDisabled) {
    disabledIds.push(index);
  }

  if (ref) {
    refs.push(ref);
  }

  const isSelected = useMemo<boolean>(() => selectedIndex === index, [
    index,
  ]);

  const tabIndex = useMemo<AllHTMLAttributes<Element>["tabIndex"]>(
    () => isSelected ? 0 : -1,
    [isSelected],
  );

  const aria = useTabAria({
    isSelected,
    tabPanelId: joinChars([id, TAB, PANEL, index], "-"),
    isDisabled,
    tabId: joinChars([id, TAB, index], "-"),
  });

  const handler = useCallback(() => {
    if (isAriaDisabled(refs[index]?.current)) return;
    setIndex(index);
  }, []);

  // deno-lint-ignore ban-types
  const eventMap = useMemo<{}>(() =>
    events.reduce((acc, cur) => {
      return { ...acc, [cur]: handler };
    }, {}), [JSON.stringify(events)]);

  const focus = useCallback((index: number): void => {
    if (!isAriaDisabled(refs[index]?.current)) {
      refs[index]?.current?.focus();
    }
  }, []);

  const updateOrFocus = useCallback((featureIndex: number): void => {
    focus(featureIndex);
    setIndex(featureIndex);
  }, []);

  const keyboardHandler = useKeyboard({
    isHorizontal,
    index,
    refs,
    type: keyboardEvent,
    callback: updateOrFocus,
  });

  return cloneElement(
    children,
    mergeProps(children.props, {
      ref,
      ...aria,
      tabIndex,
      ...eventMap,
      ...keyboardHandler,
    }),
  );
}
const WithTab = forwardRef(_WithTab);
export default WithTab;

function isNotRefAriaDisabled(
  ref: RefObject<HTMLElement | undefined>,
): boolean {
  return !isAriaDisabled(ref.current);
}

function useKeyboard(
  { isHorizontal, index, refs, callback, type }: {
    isHorizontal: boolean;
    index: number;
    refs: RefObject<HTMLElement>[];
    callback: (featureIndex: number) => void;
    type: "onKeyDown" | "onKeyUp" | false;
  },
) {
  const arrowLeftUp = useMemo<"ArrowLeft" | "ArrowUp">(
    () => isHorizontal ? "ArrowLeft" : "ArrowUp",
    [isHorizontal],
  );
  const arrowRightDown = useMemo<"ArrowRight" | "ArrowDown">(
    () => isHorizontal ? "ArrowRight" : "ArrowDown",
    [isHorizontal],
  );

  const bindIndex = useCallback(
    (code: KeyboardEvent["code"]) => {
      switch (code) {
        case arrowLeftUp: {
          const prevIndex = getPrevIndex(
            index,
            refs.map(isNotRefAriaDisabled),
          );
          return prevIndex;
        }
        case arrowRightDown: {
          const nextIndex = getNextIndex(
            index,
            refs.map(isNotRefAriaDisabled),
          );
          return nextIndex;
        }
        case "Home":
        case "PageUp": {
          const firstIndex = getFirstIndex(
            index,
            refs.map(isNotRefAriaDisabled),
          );
          return firstIndex;
        }
        case "End":
        case "PageDown": {
          const lastIndex = getLastIndex(
            index,
            refs.map(isNotRefAriaDisabled),
          );
          return lastIndex;
        }
      }
    },
    [index],
  );

  const handler = useCallback(({ code }: KeyboardEvent) => {
    const maybeIndex = bindIndex(code);
    if (isNumber(maybeIndex)) {
      callback(maybeIndex);
    }
  }, []);

  if (!type) return {};

  return {
    [type]: handler,
  };
}
