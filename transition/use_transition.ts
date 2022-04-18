// This module is browser compatible.

import { useEffect } from "react";
import { RefObject, useMemo, useState } from "react";
import { joinChars } from "../deps.ts";
import useIsomorphicLayoutEffect from "../hooks/use_isomorphic_layout_effect.ts";
import { Transition, TransitionLifecycleMap } from "./types.ts";
import useTransitionTiming from "./use_transition_timing.ts";
import {
  getDuration,
  getTransitionMap,
  mapTiming2TransitionLifecycle,
} from "./util.ts";
import { BEFORE_MOUNT, COMPLETE } from "./constant.ts";

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

export default function useTransition<T extends Element>(
  { ref, show }: Readonly<Param<T>>,
  transitionProps: Readonly<
    Partial<TransitionProps>
  >,
): ReturnValue {
  const [state, setState] = useState<boolean>(show);

  const timing = useTransitionTiming(
    () => {
      return ref.current ? getDuration(ref.current) : 0;
    },
    [show],
  );

  useEffect(() => {
    if (timing === BEFORE_MOUNT && show) {
      setState(true);
    }
  }, [timing]);

  useIsomorphicLayoutEffect(() => {
    if (timing === COMPLETE && !show) {
      setState(false);
    }
  }, [timing]);

  const transitionLifecycleMap = useMemo<TransitionLifecycleMap>(
    () => getTransitionMap(show),
    [show],
  );

  const currentTransitions = useMemo<Transition[]>(
    () => mapTiming2TransitionLifecycle(timing, transitionLifecycleMap),
    [timing, transitionLifecycleMap],
  );

  const className = useMemo<string>(() => {
    const transitions = currentTransitions.map((key) => transitionProps[key]);
    return joinChars(transitions, " ");
  }, [currentTransitions]);

  return {
    className,
    show: state,
    currentTransitions,
  };
}
