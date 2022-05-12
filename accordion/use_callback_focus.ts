// This module is browser compatible.

import { RefObject, useCallback } from "react";
import { VFn } from "../deps.ts";
import {
  getFirstIndex,
  getLastIndex,
  getNextIndex,
  getPrevIndex,
} from "../_shared/util.ts";

export type Param = {
  refs: RefObject<HTMLElement | SVGElement>[];
  index: number;
};

export type ReturnValue = {
  focusPrev: VFn;
  focusNext: VFn;
  focusFirst: VFn;
  focusLast: VFn;
};

export default function useCallbackFocus(
  { refs, index }: Param,
): ReturnValue {
  const focusPrev = useCallback<VFn>(() => {
    const matrix = refs.map(isTruthyRefObject);
    const featureIndex = getPrevIndex(index, matrix);
    refs[featureIndex]?.current?.focus();
  }, [index]);

  const focusFirst = useCallback<VFn>(() => {
    const matrix = refs.map(isTruthyRefObject);
    const featureIndex = getFirstIndex(index, matrix);
    refs[featureIndex]?.current?.focus();
  }, [index]);

  const focusNext = useCallback<VFn>(() => {
    const matrix = refs.map(isTruthyRefObject);
    const featureIndex = getNextIndex(index, matrix);
    refs[featureIndex]?.current?.focus();
  }, [index]);

  const focusLast = useCallback<VFn>(() => {
    const matrix = refs.map(isTruthyRefObject);
    const featureIndex = getLastIndex(index, matrix);
    refs[featureIndex]?.current?.focus();
  }, [index]);

  return {
    focusPrev,
    focusFirst,
    focusNext,
    focusLast,
  };
}

function isTruthyRefObject<T>(value: RefObject<T>): boolean {
  return !!value.current;
}
