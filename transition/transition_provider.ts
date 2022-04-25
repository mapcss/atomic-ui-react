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
import { cleanTokens, isShowable } from "./util.ts";
import { TransitionProps } from "./types.ts";

const defaultRender: Render = (
  { isShowable, children, ref },
): ReactElement => {
  return isShowable ? cloneElement(children, { ref }) : createElement(Fragment);
};

/** Context of rendering
 * @typeParam P - Any Props
 */
export type RenderContext<E extends Element = Element> = {
  /** Root child adapting transitions. */
  children: ReactElement;

  /** The root child `RefObject` */
  ref: RefObject<E>;

  /** Whether transition is completed and `isShow` state is `false` or not. */
  isShowable: boolean;
};
export type Render<E extends Element = Element> = (
  context: RenderContext<E>,
) => ReactElement;

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
     *       render={({ children, isShowable, ref }) => {
     *         const style = isShowable ? {} : { visibility: "hidden" };
     *         // For greater safety, a deep merge is required.
     *         return cloneElement(children, { ref, style });
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
  & Pick<Param, "isShow" | "immediate">
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
    immediate,
    onChange,
    render = defaultRender,
    ...transitionProps
  }: Readonly<
    Props<E>
  >,
): ReactElement {
  const _ref = useRef<E>(null);
  const ref = hasRef<E>(children) && !isNil(children.ref)
    ? hasRefObject(children) ? children.ref : (() => {
      throw Error(
        "[atomic-ui] Supported ref is only RefObject now. Remove ref from child",
      );
    })()
    : _ref;

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

  const { isCompleted, isActivated, classNames } = returnValue;

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

  const _isShowable = useMemo<boolean>(
    () => isShowable(isShow, { isCompleted, isActivated }),
    [isShow, isCompleted, isActivated],
  );

  useEffect(() => {
    onChange?.(returnValue);
  }, [JSON.stringify(onChange), JSON.stringify(returnValue)]);

  return render({
    isShowable: _isShowable,
    children,
    ref,
  });
}
