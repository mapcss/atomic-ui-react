// This module is browser compatible.

import { useMemo } from "react";
import { isLength0, mapValues } from "../deps.ts";
import { cleanTokens, ElementLike } from "../util.ts";
import { Transitions } from "./types.ts";
import { TransitionLifecycle } from "./use_transition_lifecycle.ts";
import { INACTIVE } from "./constant.ts";
import useTransitionContexts, {
  Contexts as UseTransitionContexts,
  Params,
} from "./use_transition_contexts.ts";

export type TransitionStatus = TransitionLifecycle | typeof INACTIVE;

export type DurationLike<E extends Element = Element> = number | ElementLike<E>;

export type Contexts = UseTransitionContexts & {
  /** The className tokens adapted currently transition. */
  classNames: string[];

  /** Non-duplicated token and space transition props.
   * It guarantee that there is no empty string or spaces only characters. */
  cleanTransitions: Partial<Transitions>;
};

export type Returns = [
  {
    /** The className adapted currently transition. */
    className: string | undefined;
  },
  Contexts,
];

/** Monitors the mount lifecycle and returns the appropriate transition status.
 * ```tsx
 * import { useRef, useState } from "react"
 * import { useTransition } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts"
 *
 * export default () => {
 *   const [isEnter] = useState(true)
 *   const ref = useRef<HTMLDivElement>(null)
 *   const [{ className }] = useTransition({ isEnter, duration: ref }, {
 *     enter: "transition duration-300",
 *     enterFrom: "opacity-0",
 *   });
 *
 *   return <div ref={ref} className={className}></div>
 *   };
 * ```
 */
export default function useTransition<T extends Element>(
  params: Readonly<Params<T>>,
  transitions: Readonly<Partial<Transitions>>,
): Returns {
  const transitionsStr = JSON.stringify(transitions);
  const transitionContexts = useTransitionContexts(params);

  const cleanTransitions = useMemo<Partial<Transitions>>(
    () => cleanRecordToken(transitions),
    [transitionsStr],
  );

  const classNames = useMemo<string[]>(() => {
    const transitions = transitionContexts.currentTransitions.map((key) =>
      cleanTransitions[key]
    );
    return cleanTokens(transitions);
  }, [
    JSON.stringify(transitionContexts.currentTransitions),
    JSON.stringify(cleanTransitions),
  ]);

  const className = useMemo<string | undefined>(() => {
    const _className = classNames.join(" ");
    return _className === "" ? undefined : _className;
  }, [JSON.stringify(classNames)]);

  const returns = useMemo<Returns>(() => {
    return [{ className }, {
      classNames,
      cleanTransitions,
      ...transitionContexts,
    }];
  }, [className, cleanTransitions, transitionContexts]);

  return returns;
}

export function cleanRecordToken<
  T extends Readonly<Record<PropertyKey, string | undefined>>,
>(record: T): T {
  return mapValues(record, (value) => {
    if (!value) return;
    const cleanedTokens = cleanTokens([value]);
    return isLength0(cleanedTokens) ? undefined : cleanedTokens.join(" ");
  }) as T;
}
