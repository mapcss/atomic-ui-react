import { useCallback, useMemo } from "react";
import useRangeCounter from "./use_range_counter.ts";
import { isUndefined } from "../deps.ts";

export type Params<T> = {
  targets: () => Iterable<T>;
};

export type Options = {
  initialIndex: number;
};

export type Callbacks = {
  prev: () => void;
  next: () => void;
  first: () => void;
  last: () => void;
};

export type States<T> = { element: T | undefined; index: number | undefined };

export type Returns<T> = [
  States<T>,
  Callbacks,
];

export default function useDoublyLinkedList<T>(
  { targets }: Readonly<Params<T>>,
  { initialIndex }: Readonly<Partial<Options>> = {},
): Returns<T> {
  const callback = useCallback(() => {
    const iters = targets();
    const array = Array.from(iters);
    return array.length - 1;
  }, [targets]);
  const [state, dispatch] = useRangeCounter(callback, initialIndex);

  const callbacks = useMemo<Callbacks>(() => ({
    prev: () => dispatch({ type: "prev" }),
    next: () => dispatch({ type: "next" }),
    first: () => dispatch({ type: "first" }),
    last: () => dispatch({ type: "last" }),
  }), [dispatch]);

  const element = useMemo<T | undefined>(() => {
    if (isUndefined(state)) return;
    const iters = targets();
    const array = Array.from(iters);
    return array[state];
  }, [targets, state]);

  return [{ element, index: state }, callbacks];
}
