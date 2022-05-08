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

  const updateAndFocus = useCallback((featureIndex: number): void => {
    if (!isAriaDisabled(refs[featureIndex]?.current)) {
      refs[featureIndex]?.current?.focus();
    }
    setIndex(featureIndex);
  }, []);

  const keyboardHandler = useKeyboard({
    isHorizontal,
    index,
    refs,
    type: keyboardEvent,
    onFire: updateAndFocus,
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
  { isHorizontal, index, refs, onFire, type }: {
    isHorizontal: boolean;
    index: number;
    refs: RefObject<HTMLElement>[];
    onFire: (featureIndex: number) => void;
    type: KeyboardHandler | false;
  },
) {
  const cursorMap = useMemo<CursorMap>(
    () => getCodeCursorTypeMap(isHorizontal),
    [isHorizontal],
  );

  const handler = useCallback(({ code }: KeyboardEvent) => {
    const cursorType = cursorMap[code];
    if (!cursorType) return;

    const indexer = CursorTypeMap[cursorType];
    const maybeIndex = indexer(index, refs.map(isNotRefAriaDisabled));
    if (isNumber(maybeIndex)) {
      onFire(maybeIndex);
    }
  }, [index, JSON.stringify(cursorMap)]);

  if (!type) return {};

  return {
    [type]: handler,
  };
}

type CursorType = "first" | "last" | "next" | "prev";

type CursorMap = { [k in string]?: CursorType };

const CursorTypeMap = {
  first: getFirstIndex,
  last: getLastIndex,
  prev: getPrevIndex,
  next: getNextIndex,
};

const staticCodeCursorMap: CursorMap = {
  Home: "first",
  PageUp: "first",
  End: "last",
  PageDown: "last",
};

function getCodeCursorTypeMap(isHorizontal: boolean): CursorMap {
  const dynamicCodeCursorMap: CursorMap = {
    [isHorizontal ? "ArrowLeft" : "ArrowUp"]: "prev",
    [isHorizontal ? "ArrowRight" : "ArrowDown"]: "next",
  };

  return {
    ...dynamicCodeCursorMap,
    ...staticCodeCursorMap,
  };
}
