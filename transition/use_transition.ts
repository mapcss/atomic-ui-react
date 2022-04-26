// This module is browser compatible.

import { DependencyList, RefObject, useMemo } from "react";
import { isLength0, mapValues } from "../deps.ts";
import { isRefObject, Lazyable, lazyEval } from "../util.ts";
import useIsFirstMount from "../hooks/use_is_first_mount.ts";
import useMutated from "../hooks/use_mutated.ts";
import { Transition, TransitionProps } from "./types.ts";
import useTransitionLifeCycle, {
  TransitionLifecycle,
  TransitionLifecycleMap,
} from "./use_transition_lifecycle.ts";
import {
  cleanTokens,
  getDuration,
  getTransitionMap,
  isShowable as _isShowable,
} from "./util.ts";
import { END, INACTIVE } from "./constant.ts";

export type TransitionStatus = TransitionLifecycle | typeof INACTIVE;

export type ElementLike<T extends Element = Element> =
  | Lazyable<T | undefined | null>
  | RefObject<T | undefined>;

export type Param<T extends Element = Element> = {
  /** Transition duration itself or it reference.
   * Specify `Element` or equivalent.
   * The duration and delay of the transition are taken from the actual DOM and used to calculate the length of the transition.
   */
  duration: ElementLike<T>;

  /** Whether the target should be shown or hidden. */
  isShow: boolean;

  /** Whether do transitions immediately(on first mount) or not.
   * - `true` - do transition on first mount.
   * - `false` - do not transition on first mount.
   * @default false
   */
  immediate?: boolean;
};

export type ReturnValue =
  & {
    /** The className adapted currently transition. */
    className: string | undefined;

    /** The className tokens adapted currently transition. */
    classNames: string[];

    /** Whether transition is completed and `isShow` state is `false` or not. */
    isShowable: boolean;

    /** Whether transition lifecycle is completed or not. */
    isCompleted: boolean;

    /** Whether the first call for this hook or not.
     * @remarks This is not a reactive value.
     */
    isFirst: boolean;

    /** Non-duplicated token and space transition props
     * It guarantee that there is no empty string or spaces only characters.
     */
    cleanTransitionProps: Partial<TransitionProps>;

    /** List of currently adapted transition. */
    currentTransitions: Transition[];
    /** Current transition lifecycle */

    status: TransitionStatus;
  }
  & ({ isActivated: true; lifecycle: TransitionLifecycle } | {
    isActivated: false;
    lifecycle: undefined;
  });

/** Monitors the mount lifecycle and returns the appropriate transition status.
 * ```tsx
 * import { useRef, useState } from "react"
 * import { useTransition } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts"
 *
 * export default () => {
 *   const [isShow] = useState(true)
 *   const ref = useRef<HTMLDivElement>(null)
 *   const { className } = useTransition({ isShow, duration: ref }, {
 *     enter: "transition duration-300",
 *     enterFrom: "opacity-0",
 *   }, [isShow]);
 *
 *   return <div ref={ref} className={className}></div>
 *   };
 * ```
 */
export default function useTransition<T extends Element>(
  { duration, isShow, immediate = false }: Readonly<Param<T>>,
  transitionProps: Readonly<
    Partial<TransitionProps>
  >,
  deps: DependencyList,
): ReturnValue {
  const { isFirstMount: isFirst } = useIsFirstMount();
  const transitionPropsStr = JSON.stringify(transitionProps);
  const hasMutate = useMutated([
    isShow,
    immediate,
    transitionPropsStr,
  ]);

  const use = useMemo<boolean>(() => {
    if (immediate) return true;
    if (isFirst) return false;

    return hasMutate;
  }, [hasMutate]);

  const [isActivated, transitionLifecycle] = useTransitionLifeCycle(
    {
      duration: () => {
        const maybeElement = resolveElement(duration);
        return maybeElement ? getDuration(maybeElement) : 0;
      },
      use,
    },
    [use, JSON.stringify(deps)],
  );

  const isCompleted = useMemo<boolean>(() => transitionLifecycle === END, [
    transitionLifecycle,
  ]);

  const transitionLifecycleMap = useMemo<TransitionLifecycleMap>(
    () => getTransitionMap(isShow),
    [isShow],
  );

  const cleanTransitionProps = useMemo<Partial<TransitionProps>>(
    () => cleanRecordToken(transitionProps),
    [transitionPropsStr],
  );

  const currentTransitions = useMemo<Transition[]>(
    () =>
      isActivated === false ? [] : transitionLifecycleMap[transitionLifecycle],
    [isActivated, transitionLifecycle, JSON.stringify(transitionLifecycleMap)],
  );

  const status = useMemo<TransitionStatus>(
    () => isActivated ? transitionLifecycle : INACTIVE,
    [isActivated, transitionLifecycle],
  );

  const isShowable = useMemo<boolean>(
    () => _isShowable(isShow, { isCompleted, isActivated }),
    [isShow, isCompleted, isActivated],
  );

  const classNames = useMemo<string[]>(() => {
    const transitions = currentTransitions.map((key) =>
      cleanTransitionProps[key]
    );
    return cleanTokens(transitions);
  }, [
    JSON.stringify(currentTransitions),
    JSON.stringify(cleanTransitionProps),
  ]);

  const className = useMemo<string | undefined>(() => {
    const _className = classNames.join(" ");
    return _className === "" ? undefined : _className;
  }, [JSON.stringify(classNames)]);

  return {
    className,
    classNames,
    isCompleted,
    isActivated,
    isShowable,
    isFirst,
    status,
    currentTransitions,
    lifecycle: transitionLifecycle as never, // for conditional types,
    cleanTransitionProps,
  };
}

export function resolveElement<E extends Element>(
  elementLike: ElementLike<E>,
): E | undefined | null {
  if (isRefObject(elementLike)) {
    return elementLike.current;
  }

  return lazyEval(elementLike);
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
