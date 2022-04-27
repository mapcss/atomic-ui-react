// This module is browser compatible.

import {
  cloneElement,
  createElement,
  Fragment,
  ReactElement,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { isBoolean, isNil, ValueOf } from "../deps.ts";
import { hasRef, hasRefObject } from "../util.ts";
import { Context, IsShowContext } from "./context.ts";
import useIsomorphicLayoutEffect from "../hooks/use_isomorphic_layout_effect.ts";
import useTransition, {
  ReturnValue as UseTransitionReturnValue,
} from "./use_transition.ts";
import useGroupTransition, {
  ReturnValue as UseGroupTransitionReturnValue,
} from "./use_group_transition.ts";
import { Props as _Props } from "./transition_provider.ts";
import { cleanTokens } from "./util.ts";
import { TransitionMap } from "./types.ts";

const defaultRender: Render = (
  { children, ref },
  context,
): ReactElement => {
  const { isReady, isShowable, isRoot } = context;
  const predict = isRoot ? isReady : isShowable;
  return predict ? cloneElement(children, { ref }) : createElement(Fragment);
};

export type RenderParam<E extends Element = Element> = {
  /** Root child adapting transitions. */
  children: ReactElement;

  /** The root child `RefObject` */
  ref: RefObject<E>;
};

export type Props<E extends Element = Element> =
  & Omit<_Props, "children" | "duration">
  & {
    /** The root child adapting transitions. */
    children: ReactElement;

    /** Controls the rendering element. Called just before rendering, it returns the element to actually render.
     * ```tsx
     * import { cloneElement } from "react"
     * import { Transition } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts"
     * export default () => {
     *   return (
     *     <Transition
     *       render={({ children, ref }) => {
     *         return cloneElement(children, { ref });
     *       }}
     *       isShow
     *     >
     *       <></>
     *     </Transition>
     *   );
     * };
     * ```
     * @default {@link defaultRender}
     */
    render?: Render<E>;

    /** Whether this component is transition root or not. */
    isRoot?: boolean;
  };

/** Context of rendering */
export type RenderContext =
  & UseTransitionReturnValue
  & UseGroupTransitionReturnValue
  & Required<Pick<Props, "isShow" | "immediate" | "isRoot">>;
export type Render<E extends Element = Element> = (
  param: RenderParam<E>,
  context: RenderContext,
) => ReactElement;

/** Component to automatically adapt transitions to the root child.
 * ```tsx
 * import { Transition } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts"
 * export default () => {
 *   return (
 *     <Transition
 *       enter="transition duration-300"
 *       enterFrom="opacity-0"
 *       isShow
 *     >
 *       <div />
 *     </Transition>
 *   );
 * };
 * ```
 */
export default function Transition<E extends Element = Element>(
  {
    children,
    isShow,
    immediate = false,
    onChange,
    render = defaultRender,
    isRoot = isBoolean(isShow),
    ...transitionProps
  }: Readonly<Props<E>>,
): ReactElement {
  const _ref = useRef<E>(null);
  const ref = resolveRef<E>(children) ?? _ref;

  const transitionPropsStr = JSON.stringify(transitionProps);
  const returnValue = useTransition(
    { duration: ref, isShow, immediate },
    transitionProps,
    [isShow, immediate, transitionPropsStr],
  );
  const childStateSet = useState<UseTransitionReturnValue | undefined>(
    undefined,
  );

  const useGroupTransitionReturnValue = useGroupTransition(
    returnValue,
    childStateSet[0],
  );

  const allTransitions = useMemo<string[]>(() =>
    cleanTokens(
      Object.values(transitionProps) as ValueOf<TransitionMap>[],
    ), [transitionPropsStr]);

  const { classNames } = returnValue;

  useIsomorphicLayoutEffect(() => {
    const classList = ref.current?.classList;
    if (!classList) return;
    try {
      classList.remove(...allTransitions);
      classList.add(...classNames);
    } catch {
      // noop
    }
  }, [JSON.stringify(allTransitions), JSON.stringify(classNames)]);

  useEffect(() => {
    onChange?.(returnValue);
  }, [JSON.stringify(onChange), JSON.stringify(returnValue)]);

  return createElement(
    IsShowContext.Provider,
    { value: isShow },
    createElement(
      Context.Provider,
      { value: childStateSet },
      render({
        children,
        ref,
      }, {
        ...returnValue,
        ...useGroupTransitionReturnValue,
        isShow,
        immediate,
        isRoot,
      }),
    ),
  );
}

function resolveRef<E>(
  children: ReactElement,
): RefObject<E> | undefined | never {
  if (!hasRef<E>(children) || isNil(children.ref)) return;

  if (hasRefObject(children)) return children.ref;
  throw Error(
    "[atomic-ui] Supported ref is only RefObject.",
  );
}
