// This module is browser compatible.

import { RefObject, useMemo, useState } from "react";
import { isBrowser, joinChars } from "../deps.ts";
import useOnMount from "../hooks/use_on_mount.ts";
import { getDuration } from "./util.ts";

type Transition =
  | "enterFrom"
  | "enterTo"
  | "enter"
  | "leaveFrom"
  | "leaveTo"
  | "leave";

type Timing = "init" | "start" | "via" | "fin";

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
  className: string | undefined;
  show: boolean;
};

export type TransitionProps = Partial<Record<Transition, string>>;

export default function useTransition<T extends Element>(
  { ref, show }: Readonly<Param<T>>,
  { enter, enterFrom, enterTo, leave, leaveFrom, leaveTo }: Readonly<
    TransitionProps
  >,
): ReturnValue {
  const [timing, setTiming] = useState<Timing>("init");
  const [state, setState] = useState<boolean>(show);

  const className = useMemo<string | undefined>(() =>
    mapClassName(
      timing,
      classNameMap({
        enter,
        enterFrom,
        enterTo,
        leave,
        leaveFrom,
        leaveTo,
      }, show),
    ), [timing, show]);

  useOnMount({
    onBeforeMount: () => {
      setTiming("init");
      if (show) {
        setState(true);
      }
    },
    onMount: () => {
      setTiming("start");
      if (!ref.current) return;
      const delay = getDuration(ref.current);
      const id = setTimeout(() => {
        setTiming("fin");
        if (!show) {
          setState(false);
        }
      }, delay);

      return () => clearTimeout(id);
    },
    onAfterMount: () => setTiming("via"),
  }, { deps: [show] });

  return {
    className,
    show: state,
  };
}

export function currentClassName(
  timing: Timing,
  { from, via, to }: TimingProps,
): string | undefined {
  switch (timing) {
    case "init": {
      return joinChars([from], " ");
    }
    case "start": {
      return joinChars([from, via], " ");
    }
    case "via": {
      return joinChars([to, via], " ");
    }
    default: {
      return undefined;
    }
  }
}

export function mapClassName(
  timing: Timing,
  timingProps: Readonly<TimingProps>,
): string | undefined {
  if (!isBrowser) return;
  return currentClassName(timing, timingProps);
}

export function classNameMap(
  { enter, enterFrom, enterTo, leave, leaveFrom, leaveTo }: Readonly<
    TransitionProps
  >,
  isEnter: boolean,
): TimingProps {
  return {
    from: isEnter ? enterFrom : leaveFrom,
    to: isEnter ? enterTo : leaveTo,
    via: isEnter ? enter : leave,
  };
}
