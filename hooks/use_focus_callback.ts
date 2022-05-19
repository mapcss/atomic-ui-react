import { useCallback } from "react";
import { VFn } from "../deps.ts";
import {
  getFirstIndex,
  getLastIndex,
  getNextIndex,
  getPrevIndex,
} from "../_shared/util.ts";

export type ReturnValue = {
  focusPrev: VFn;
  focusNext: VFn;
  focusFirst: VFn;
  focusLast: VFn;
};

export type Targets = () => Iterable<HTMLElement | SVGElement | MathMLElement>;

export default function useFocusCallback(
  targets: Targets,
): ReturnValue {
  const focusPrev = useCallback<VFn>(() => {
    const els = targets();
    const arrayEls = Array.from(els);

    const index = getRelativeIndex(arrayEls) ?? 0;
    const matrix = arrayEls.map(Boolean);
    const featureIndex = getPrevIndex(index, matrix);

    arrayEls[featureIndex]?.focus();
  }, [targets]);

  const focusNext = useCallback<VFn>(() => {
    const els = targets();
    const arrayEls = Array.from(els);

    const index = getRelativeIndex(arrayEls) ?? quantity(arrayEls);
    const matrix = arrayEls.map(Boolean);
    const featureIndex = getNextIndex(index, matrix);

    arrayEls[featureIndex]?.focus();
  }, [targets]);

  const focusFirst = useCallback<VFn>(() => {
    const els = targets();
    const array = Array.from(els);

    const index = getRelativeIndex(array) ?? 0;
    const matrix = array.map(Boolean);

    const featureIndex = getFirstIndex(index, matrix);
    array[featureIndex]?.focus();
  }, [targets]);
  const focusLast = useCallback<VFn>(() => {
    const els = targets();
    const array = Array.from(els);

    const index = getRelativeIndex(array) ?? 0;
    const matrix = array.map(Boolean);

    const featureIndex = getLastIndex(index, matrix);
    array[featureIndex]?.focus();
  }, [targets]);

  return {
    focusPrev,
    focusNext,
    focusFirst,
    focusLast,
  };
}

function getRelativeIndex(els: Iterable<Element>): number | undefined {
  const activeEl = document.activeElement;
  const array = Array.from(els);
  const activeIndex = array.findIndex((el) => el.isSameNode(activeEl));
  if (activeIndex < 0) {
    return;
  }

  return activeIndex;
}

function quantity({ length }: { length: number }): number {
  return length - 1;
}
