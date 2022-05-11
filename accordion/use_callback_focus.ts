// This module is browser compatible.

import { KeyboardEventHandler, RefObject, useCallback } from "react";
import {
  getFirstIndex,
  getLastIndex,
  getNextIndex,
  getPrevIndex,
} from "../_shared/util.ts";

export default function useCallbackFocus(
  { refs, index }: { refs: RefObject<HTMLElement>[]; index: number },
) {
  const prev = useCallback<KeyboardEventHandler>((ev) => {
    ev.preventDefault();
    const matrix = refs.map(isTruthyRefObject);
    const featureIndex = getPrevIndex(index, matrix);
    refs[featureIndex]?.current?.focus();
  }, [index]);

  const first = useCallback<KeyboardEventHandler>((ev) => {
    ev.preventDefault();
    const matrix = refs.map(isTruthyRefObject);
    const featureIndex = getFirstIndex(index, matrix);
    refs[featureIndex]?.current?.focus();
  }, [index]);

  const next = useCallback<KeyboardEventHandler>((ev) => {
    ev.preventDefault();
    const matrix = refs.map(isTruthyRefObject);
    const featureIndex = getNextIndex(index, matrix);
    refs[featureIndex]?.current?.focus();
  }, [index]);

  const last = useCallback<KeyboardEventHandler>((ev) => {
    ev.preventDefault();
    const matrix = refs.map(isTruthyRefObject);
    const featureIndex = getLastIndex(index, matrix);
    refs[featureIndex]?.current?.focus();
  }, [index]);

  return {
    prev,
    first,
    next,
    last,
  };
}

function isTruthyRefObject<T>(value: RefObject<T>): boolean {
  return !!value.current;
}
