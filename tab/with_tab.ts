// This module is browser compatible.

import {
  AllHTMLAttributes,
  cloneElement,
  forwardRef as _forwardRef,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactElement,
  Ref,
  RefObject,
  useContext,
  useMemo,
  useRef,
} from "react";
import useTabAria, { Param } from "./use_tab_aria.ts";
import { joinChars, resolveRefObject } from "../util.ts";
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

export type Props = {
  children: ReactElement;
} & Partial<Pick<Param, "isDisabled">>;

function _WithTab<T extends HTMLElement>(
  {
    isDisabled,
    children,
  }: Props,
  _ref: Ref<T>,
): JSX.Element {
  const id = useContext(IdContext);
  const [index, setIndex] = useContext(IndexContext);
  const tabCount = useContext(TabCountContext);
  const refs = useContext(TabRefsContext);
  const isHorizontal = useContext(HorizontalContext);
  const disabledIds = useContext(DisabledIdsContext);
  const currentIndex = tabCount.current;
  const el = useRef<T>(null);
  const ref = resolveRefObject<T>(_ref) ?? el;

  if (isDisabled) {
    disabledIds.push(currentIndex);
  }

  if (ref) {
    refs.push(ref);
  }

  const isSelected = useMemo<boolean>(() => index === currentIndex, [
    index,
  ]);

  const tabIndex = useMemo<AllHTMLAttributes<Element>["tabIndex"]>(
    () => isSelected ? 0 : -1,
    [isSelected],
  );

  const aria = useTabAria({
    isSelected,
    tabPanelId: joinChars([id, TAB, PANEL, currentIndex], "-"),
    isDisabled,
  });
  const _id = joinChars([id, TAB, currentIndex], "-");

  const onClick: MouseEventHandler = () => {
    if (isAriaDisabled(refs[currentIndex]?.current)) return;
    setIndex(currentIndex);
  };

  const arrowLeftUp = useMemo<"ArrowLeft" | "ArrowUp">(
    () => isHorizontal ? "ArrowLeft" : "ArrowUp",
    [isHorizontal],
  );
  const arrowRightDown = useMemo<"ArrowRight" | "ArrowDown">(
    () => isHorizontal ? "ArrowRight" : "ArrowDown",
    [isHorizontal],
  );

  const onKeyDown: KeyboardEventHandler = (ev) => {
    switch (ev.code) {
      case arrowLeftUp: {
        const prevIndex = getPrevIndex(
          currentIndex,
          refs.map(isNotRefAriaDisabled),
        );
        updateOrFocus(index, prevIndex);
        break;
      }
      case arrowRightDown: {
        const nextIndex = getNextIndex(
          currentIndex,
          refs.map(isNotRefAriaDisabled),
        );
        updateOrFocus(index, nextIndex);
        break;
      }
      case "Home":
      case "PageUp": {
        const firstIndex = getFirstIndex(
          currentIndex,
          refs.map(isNotRefAriaDisabled),
        );
        updateOrFocus(index, firstIndex);
        break;
      }
      case "End":
      case "PageDown": {
        const lastIndex = getLastIndex(
          currentIndex,
          refs.map(isNotRefAriaDisabled),
        );
        updateOrFocus(index, lastIndex);
        break;
      }
    }
  };

  const focus = (index: number): void => {
    if (!isAriaDisabled(refs[index]?.current)) {
      refs[index]?.current?.focus();
    }
  };

  const updateOrFocus = (_: number, featureIndex: number): void => {
    focus(featureIndex);
    setIndex(featureIndex);
  };

  return cloneElement(children, {
    ref,
    ...aria,
    tabIndex,
    onClick,
    onKeyDown,
    id: _id,
  });
}
const WithTab = _forwardRef(_WithTab);
export default WithTab;

function isNotRefAriaDisabled(
  ref: RefObject<HTMLElement | undefined>,
): boolean {
  return !isAriaDisabled(ref.current);
}
