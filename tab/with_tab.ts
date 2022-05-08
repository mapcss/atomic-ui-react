// This module is browser compatible.

import {
  AllHTMLAttributes,
  cloneElement,
  DOMAttributes,
  ReactElement,
  RefObject,
  useCallback,
  useContext,
  useMemo,
} from "react";
import useTabAria, { Param } from "./use_tab_aria.ts";
import { isNumber } from "../deps.ts";
import { joinChars, mergeProps } from "../util.ts";
import useSharedRef from "../hooks/use_shared_ref.ts";
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

type AllHandlerMap = Omit<
  DOMAttributes<Element>,
  "children" | "dangerouslySetInnerHTML"
>;

type KeyboardHandler = keyof Pick<
  AllHandlerMap,
  "onKeyDown" | "onKeyUp"
>;

type Handler = Exclude<keyof AllHandlerMap, KeyboardHandler>;
type HandlerMap = { [k in Handler]?: () => void };

export type Props = {
  children: ReactElement;

  keyboardHandler?: KeyboardHandler | false;

  handlers?: Iterable<Handler>;
} & Partial<Pick<Param, "isDisabled">>;

export default function WithTab(
  {
    isDisabled,
    children,
    keyboardHandler = "onKeyDown",
    handlers = ["onClick"],
  }: Readonly<Props>,
): JSX.Element {
  const id = useContext(IdContext);
  const [selectedIndex, setIndex] = useContext(IndexContext);
  const tabCount = useContext(TabCountContext);
  const refs = useContext(TabRefsContext);
  const isHorizontal = useContext(HorizontalContext);
  const disabledIds = useContext(DisabledIdsContext);
  const index = tabCount.current;
  const ref = useSharedRef<HTMLElement>(children);

  refs.push(ref);
  if (isDisabled) {
    disabledIds.push(index);
  }

  const isSelected = useMemo<boolean>(() => selectedIndex === index, [
    index,
    selectedIndex,
  ]);

  const tabIndex = useMemo<AllHTMLAttributes<HTMLElement>["tabIndex"]>(
    () => isSelected ? 0 : -1,
    [isSelected],
  );

  const aria = useTabAria({
    isSelected,
    tabPanelId: joinChars([id, TAB, PANEL, index], "-"),
    isDisabled,
    tabId: joinChars([id, TAB, index], "-"),
  });

  const handlerMap = useMemo<HandlerMap>(
    () =>
      Array.from(handlers).reduce((acc, cur) => {
        return { ...acc, [cur]: () => updateAndFocus(index) };
      }, {}),
    [JSON.stringify(handlers), index],
  );

  const updateAndFocus = useCallback((featureIndex: number): void => {
    if (!isAriaDisabled(refs[featureIndex]?.current)) {
      refs[featureIndex]?.current?.focus();
      setIndex(featureIndex);
    }
  }, []);

  const keyboardHandlerMap = useKeyboard({
    isHorizontal,
    index,
    refs,
    type: keyboardHandler,
    onFire: updateAndFocus,
  });

  return cloneElement(
    children,
    mergeProps(children.props, {
      ref,
      tabIndex,
      ...aria,
      ...handlerMap,
      ...keyboardHandlerMap,
    }),
  );
}

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
