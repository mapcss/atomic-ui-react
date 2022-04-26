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
} from "react";
import { isNil, ValueOf } from "../deps.ts";
import { hasRef, hasRefObject } from "../util.ts";
import useTransition, { ReturnValue } from "./use_transition.ts";
import { Props as _Props } from "./transition_provider.ts";
import { cleanTokens } from "./util.ts";
import { TransitionMap } from "./types.ts";

const defaultRender: Render = (
  { children, ref },
  { isShowable, cleanTransitionProps: { leaved }, isActivated, isShow },
): ReactElement => {
  return (isActivated && (isShowable || leaved)) || (!isActivated && isShow)
    ? cloneElement(children, { ref })
    : createElement(Fragment);
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
  };

/** Context of rendering */
export type RenderContext =
  & ReturnValue
  & Required<Pick<Props, "isShow" | "immediate">>;
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

  const allTransitions = useMemo<string[]>(() =>
    cleanTokens(
      Object.values(transitionProps) as ValueOf<TransitionMap>[],
    ), [transitionPropsStr]);

  const { classNames } = returnValue;

  useEffect(() => {
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

  return render({
    children,
    ref,
  }, { ...returnValue, isShow, immediate });
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
