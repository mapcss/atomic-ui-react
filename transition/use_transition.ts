// This module is browser compatible.

import { RefObject, useMemo, useState } from "react";
import { joinChars } from "../deps.ts";
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
  from: string | undefined;
  to: string | undefined;
  via: string | undefined;
};

export type Param<T extends Element> = {
  ref: RefObject<T | undefined>;
  show: boolean;
};

export type ReturnValue = {
  className: string;
  show: boolean;
};

export type TransitionProps = Record<Transition, string>;

type Stage = 0 | 1 | 2 | 3;

export default function useTransition<T extends Element>(
  { ref, show }: Readonly<Param<T>>,
  { enter, enterFrom, enterTo, leave, leaveFrom, leaveTo }: Readonly<
    Partial<TransitionProps>
  >,
): ReturnValue {
  const [state, setState] = useState<boolean>(show);
  const [stage, next] = useState<Stage>(0);

  const className = useMemo<string>(() =>
    currentClassName(
      stage,
      classNameMap({
        enter,
        enterFrom,
        enterTo,
        leave,
        leaveFrom,
        leaveTo,
      }, show),
    ) ?? "", [
    stage,
    enter,
    enterFrom,
    enterTo,
    leave,
    leaveFrom,
    leaveTo,
    show,
  ]);

  useOnMount({
    onBeforeMount: () => {
      next(0);
      if (show) {
        setState(true);
      }
    },
    onMount: () => next(1),
    onAfterMount: () => {
      next(2);

      const delay = ref.current ? getDuration(ref.current) : 0;
      const id = setTimeout(() => {
        next(3);
        if (!show) {
          setState(false);
        }
      }, delay);
      return () => clearTimeout(id);
    },
  }, { deps: [show] });

  return {
    className,
    show: state,
  };
}

export function currentClassName(
  stage: Stage,
  { from, via, to }: TimingProps,
): string | undefined {
  console.log(from);
  switch (stage) {
    case 0: {
      return joinChars([from], " ");
    }
    case 1: {
      return joinChars([from, via], " ");
    }
    case 2: {
      return joinChars([to, via], " ");
    }
    default: {
      return undefined;
    }
  }
}

export function classNameMap(
  { enter, enterFrom, enterTo, leave, leaveFrom, leaveTo }: Readonly<
    Partial<TransitionProps>
  >,
  isEnter: boolean,
): TimingProps {
  return {
    from: isEnter ? enterFrom : leaveFrom,
    to: isEnter ? enterTo : leaveTo,
    via: isEnter ? enter : leave,
  };
}
