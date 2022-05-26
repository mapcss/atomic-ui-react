import { Dispatch, Reducer, useCallback, useReducer } from "react";
import { isUndefined } from "../deps.ts";
import { Lazyable, lazyEval } from "../util.ts";

type Type = "prev" | "next" | "first" | "last";

const reducer: Reducer<
  number | undefined,
  { type: Type; payload: { max: number } }
> = (
  value,
  { type, payload: { max } },
) => {
  switch (type) {
    case "prev": {
      if (isUndefined(value)) return max;
      return prev({ current: value, max });
    }
    case "next": {
      if (isUndefined(value)) return 0;
      return next({ current: value, max });
    }
    case "first": {
      if (isUndefined(value)) return 0;
      return first({ current: value, max });
    }
    case "last": {
      if (isUndefined(value)) return max;
      return last({ current: value, max });
    }
    default:
      throw new Error();
  }
};

export type Returns = [number | undefined, Dispatch<{ type: Type }>];

export default function useRangeCounter(
  max: Lazyable<number>,
  initialState: number | undefined = undefined,
): Returns {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setState = useCallback<Dispatch<{ type: Type }>>(
    ({ type }) => {
      const value = lazyEval(max);
      dispatch({ type, payload: { max: value } });
    },
    [dispatch, max],
  );

  return [state, setState];
}

type Range = { current: number; max: number };

export function prev({ current, max }: Readonly<Range>): number {
  if (max <= 0) return 0;
  const prev = current - 1;
  if (prev < 0) return max;

  return prev;
}

export function next({ current, max }: Readonly<Range>): number {
  if (max <= 0) return 0;
  const next = current + 1;
  if (max < next) return 0;

  return next;
}

export function first(_: Readonly<Range>): number {
  return 0;
}

export function last({ max }: Readonly<Range>): number {
  return max;
}
