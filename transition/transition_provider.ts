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
import useTransition, { Param, ReturnValue } from "./use_transition.ts";
import { cleanTokens } from "./util.ts";
import { TransitionProps } from "./types.ts";

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

/** Context of rendering */
export type RenderContext = ReturnValue & Required<WithoutTarget>;
export type Render<E extends Element = Element> = (
  param: RenderParam<E>,
  context: RenderContext,
) => ReactElement;

type WithoutTarget = Pick<Param, "isShow" | "immediate">;

export type Props<E extends Element = Element> =
  & {
    /** The root child adapting transitions. */
    children: ReactElement;

    /** Call on change transition states. */
    onChange?: (state: ReturnValue) => void;

    /** Controls the rendering element. Called just before rendering, it returns the element to actually render.
     * ```tsx
     * import { cloneElement } from "react"
     * import { TransitionProvider } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts"
     * export default () => {
     *   return (
     *     <TransitionProvider
     *       render={({ children, ref }) => {
     *         return cloneElement(children, { ref });
     *       }}
     *       isShow
     *     >
     *       <></>
     *     </TransitionProvider>
     *   );
     * };
     * ```
     * @default {@link defaultRender}
     */
    render?: Render<E>;
  }
  & WithoutTarget
  & Partial<TransitionProps>;

/** Component to automatically adapt transitions to the root child.
 * ```tsx
 * import { TransitionProvider } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts"
 * export default () => {
 *   return (
 *     <TransitionProvider
 *       enter="transition duration-300"
 *       enterFrom="opacity-0"
 *       isShow
 *     >
 *       <div />
 *     </TransitionProvider>
 *   );
 * };
 * ```
 */
export default function TransitionProvider<E extends Element = Element>(
  {
    children,
    isShow,
    immediate = false,
    onChange,
    render = defaultRender,
    ...transitionProps
  }: Readonly<
    Props<E>
  >,
): ReactElement {
  const _ref = useRef<E>(null);
  const ref = resolveRef<E>(children) ?? _ref;

  const transitionPropsStr = JSON.stringify(transitionProps);
  const returnValue = useTransition(
    { target: ref, isShow, immediate },
    transitionProps,
    [isShow, immediate, transitionPropsStr],
  );

  const allTransitions = useMemo<string[]>(() =>
    cleanTokens(
      Object.values(transitionProps) as ValueOf<TransitionProps>[],
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
