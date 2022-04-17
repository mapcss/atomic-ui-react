// This module is browser compatible.

import { DependencyList, RefObject, useMemo, useRef, useState } from "react";
import { isBrowser, joinChars, VFn } from "../deps.ts";
import useIsomorphicLayoutEffect from "../hooks/use_isomorphic_layout_effect.ts";

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

  useTimingEffect({
    onInit: () => {
      setTiming("init");
      if (show) {
        setState(true);
      }
    },
    onStart: () => setTiming("start"),
    onVia: () => setTiming("via"),
    onEnd: () => {
      setTiming("fin");
      if (!show) {
        setState(false);
      }
    },
    delay: () => {
      if (!ref.current) return;
      return getDuration(ref.current);
    },
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

export function useTimingEffect(
  { onInit, onStart, onVia, onEnd, delay }: Partial<
    {
      onInit: VFn;
      onStart: VFn;
      onVia: VFn;
      onEnd: VFn;
      delay: () => number | undefined;
    }
  >,
  option?: Partial<{ deps: DependencyList; use: boolean }>,
): void {
  const idRef = useRef<number>();
  const tidRef = useRef<number>();

  useIsomorphicLayoutEffect(() => {
    onInit?.();
    const id = requestAnimationFrame(() => {
      onStart?.();
      idRef.current = requestAnimationFrame(() => {
        onVia?.();
      });
      tidRef.current = setTimeout(() => {
        onEnd?.();
      }, delay?.());
    });

    return () => {
      cancelAnimationFrame(id);
      clearTimeout(tidRef.current);
      if (idRef.current) {
        cancelAnimationFrame(idRef.current);
      }
    };
  }, option?.deps);
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

/** Compute transition duration from `CSSStyleDeclaration` */
export function getDuration(el: Element): number {
  try {
    const { transitionDuration } = globalThis.getComputedStyle(el);

    const num = Number.parseFloat(transitionDuration);
    if (!Number.isFinite(num)) return 0;

    return num * 1000;
  } catch {
    return 0;
  }
}
