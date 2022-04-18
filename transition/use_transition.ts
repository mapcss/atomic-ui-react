// This module is browser compatible.

import { DependencyList, useEffect, useLayoutEffect } from "react";
import { RefObject, useMemo, useState } from "react";
import {
  Callable,
  evaluate,
  filterTruthy,
  joinChars,
  ValueOf,
} from "../deps.ts";
import useOnMount from "../hooks/use_on_mount.ts";
import { getDuration } from "./util.ts";

type Transition =
  | "enterFrom"
  | "enterTo"
  | "enter"
  | "leaveFrom"
  | "leaveTo"
  | "leave";

type TimingProps = {
  from: Transition;
  to: Transition;
  via: Transition;
};

function useTiming(
  { extension }: { extension: Callable<number> },
  deps?: DependencyList,
) {
  const [state, next] = useState<Stage>(0);

  useOnMount({
    onBeforeMount: () => {
      next(0);
    },
    onAfterMount: () => {
      next(1);

      let tid: number;

      const rid = requestAnimationFrame(() => {
        const ms = evaluate(extension);
        tid = setTimeout(() => {
          next(3);
        }, ms);

        next(2);
      });

      return () => {
        cancelAnimationFrame(rid);
        if (tid) {
          clearTimeout(tid);
        }
      };
    },
  }, { deps });

  const timing = useMemo(() => {
    return LABEL[state];
  }, [state]);

  return timing;
}

const LABEL = {
  0: "beforeMount",
  1: "mount",
  2: "afterMount",
  3: "complete",
} as const;

export type Param<T extends Element> = {
  ref: RefObject<T | undefined>;
  show: boolean;
};

export type ReturnValue = {
  className: string;
  show: boolean;
  currentTransitions: Transition[];
};

export type TransitionProps = Record<Transition, string>;

type Stage = 0 | 1 | 2 | 3;

export default function useTransition<T extends Element>(
  { ref, show }: Readonly<Param<T>>,
  transitionProps: Readonly<
    Partial<TransitionProps>
  >,
): ReturnValue {
  const [state, setState] = useState<boolean>(show);

  const timing = useTiming({
    extension: () => {
      return ref.current ? getDuration(ref.current) : 0;
    },
  }, [show]);

  useEffect(() => {
    if (timing === "beforeMount" && show) {
      setState(true);
    }
  }, [timing]);

  useLayoutEffect(() => {
    if (timing === "complete" && !show) {
      setState(false);
    }
  }, [timing]);

  const currentTransitions = useMemo<Transition[]>(() => {
    const mapped = classNameMap(show);
    return filterTruthy(mapCurrentClassNames(timing, mapped));
  }, [timing, show]);

  const className = useMemo<string>(() => {
    const transitions = filterTruthy(currentTransitions).map((key) =>
      transitionProps[key]
    );
    return joinChars(transitions, " ");
  }, [currentTransitions]);

  return {
    className,
    show: state,
    currentTransitions,
  };
}

export function mapCurrentClassNames(
  stage: ValueOf<typeof LABEL>,
  { from, via, to }: TimingProps,
): (Transition | undefined)[] {
  switch (stage) {
    case "beforeMount": {
      return [from];
    }
    case "mount": {
      return [from, via];
    }
    case "afterMount": {
      return [to, via];
    }
    default: {
      return [];
    }
  }
}

export function classNameMap(
  isEnter: boolean,
): TimingProps {
  return {
    from: isEnter ? "enterFrom" : "leaveFrom",
    to: isEnter ? "enterTo" : "leaveTo",
    via: isEnter ? "enter" : "leave",
  };
}
