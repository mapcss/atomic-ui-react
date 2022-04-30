// This module is browser compatible.

import { DependencyList, useMemo, useState } from "react";
import { isLength0, isNumber, mapValues } from "../deps.ts";
import useIsomorphicLayoutEffect from "../hooks/use_isomorphic_layout_effect.ts";
import { ElementLike, resolveElementLike } from "../util.ts";
import useIsFirstMount from "../hooks/use_is_first_mount.ts";
import useMutated from "../hooks/use_mutated.ts";
import { TransitionMap, TransitionName } from "./types.ts";
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
import { END, ENTER, INACTIVE, LEAVE } from "./constant.ts";

export type TransitionStatus = TransitionLifecycle | typeof INACTIVE;

export type DurationLike<E extends Element = Element> = number | ElementLike<E>;

export type Param<E extends Element = Element> = {
  /** Transition duration itself or it reference.
   * Specify `Element` or equivalent.
   * The duration and delay of the transition are taken from the actual DOM and used to calculate the length of the transition.
   */
  duration: DurationLike<E>;

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
    cleanTransitionMap: Partial<TransitionMap>;

    /** List of currently adapted transition. */
    currentTransitions: TransitionName[];
    /** Current transition lifecycle */

    status: TransitionStatus;
  }
  & ({
    isActivated: true;
    lifecycle: TransitionLifecycle;

    /** Current transition mode.
     * If it is not activated, return `undefined`
     */
    mode: typeof ENTER | typeof LEAVE;
  } | {
    isActivated: false;
    lifecycle: undefined;
    mode: undefined;
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
    Partial<TransitionMap>
  >,
  deps: DependencyList,
): ReturnValue {
  const { isFirstMount: isFirst } = useIsFirstMount();
  const transitionPropsStr = JSON.stringify(transitionProps);
  const lazyIsShow = useLazyState(isShow);
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
      duration: () => resolveDurationLike(duration),
      use,
    },
    [use, JSON.stringify(deps)],
  );

  const isCompleted = useMemo<boolean>(() => transitionLifecycle === END, [
    transitionLifecycle,
  ]);

  const transitionLifecycleMap = useMemo<TransitionLifecycleMap>(
    () => getTransitionMap(lazyIsShow),
    [lazyIsShow],
  );

  const cleanTransitionMap = useMemo<Partial<TransitionMap>>(
    () => cleanRecordToken(transitionProps),
    [transitionPropsStr],
  );

  const currentTransitions = useMemo<TransitionName[]>(
    () =>
      isActivated === false ? [] : transitionLifecycleMap[transitionLifecycle],
    [isActivated, transitionLifecycle, JSON.stringify(transitionLifecycleMap)],
  );

  const status = useMemo<TransitionStatus>(
    () => isActivated ? transitionLifecycle : INACTIVE,
    [isActivated, transitionLifecycle],
  );

  const isShowable = useMemo<boolean>(
    () => _isShowable(lazyIsShow, { isCompleted, isActivated }),
    [lazyIsShow, isCompleted, isActivated],
  );

  const classNames = useMemo<string[]>(() => {
    const transitions = currentTransitions.map((key) =>
      cleanTransitionMap[key]
    );
    return cleanTokens(transitions);
  }, [
    JSON.stringify(currentTransitions),
    JSON.stringify(cleanTransitionMap),
  ]);

  const mode = useMemo<typeof LEAVE | typeof ENTER | undefined>(
    () => use ? lazyIsShow ? ENTER : LEAVE : undefined,
    [lazyIsShow, use],
  );

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
    lifecycle: transitionLifecycle as never, // for conditional types
    mode: mode as never, // for conditional types
    cleanTransitionMap,
  };
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

export function resolveDurationLike<E extends Element = Element>(
  durationLike: DurationLike<E>,
): number {
  if (isNumber(durationLike)) {
    return Number.isFinite(durationLike) ? durationLike : 0;
  }
  const maybeElement = resolveElementLike(durationLike);
  return maybeElement ? getDuration(maybeElement) : 0;
}

function useLazyState(value: boolean, deps?: DependencyList): boolean {
  const [state, setState] = useState(value);
  useIsomorphicLayoutEffect(() => {
    setState(value);
  }, [value, JSON.stringify(deps)]);

  return state;
}
