// This module is browser compatible.
// deno-lint-ignore-file no-explicit-any

import {
  cloneElement,
  createElement,
  Fragment,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { isNil, isNumber, isString, joinChars } from "../deps.ts";
import { hasRef, hasRefObject } from "../util.ts";
import useTransition, { Param, ReturnValue } from "./use_transition.ts";
import { isShowable } from "./util.ts";
import { TransitionProps } from "./types.ts";

const defaultRender: Render<any> = (
  { isShowable, children, mergedProps },
): ReactElement => {
  return isShowable
    ? cloneElement(children, mergedProps)
    : createElement(Fragment);
};

/** Context of rendering
 * @typeParam P - Any Props
 */
export type RenderContext<P> = {
  /** Root child adapting transitions. */
  children: ReactElement;

  /** Props that deep merged with children root props and transition props */
  mergedProps: Partial<P>;

  /** Whether transition is completed and `isShow` state is `false` or not. */
  isShowable: boolean;
};
export type Render<P> = (context: RenderContext<P>) => ReactElement;

export type Props<P = any> =
  & {
    /** Root child adapting transitions. */
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
     *       render={({ children, mergedProps, isShowable }) => {
     *         const style = isShowable ? {} : { visibility: "hidden" };
     *         // For greater safety, a deep merge is required.
     *         return cloneElement(children, { ...mergedProps, style });
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
    render?: Render<P>;
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
export default function TransitionProvider<P>(
  {
    children,
    isShow,
    immediate,
    onChange,
    render = defaultRender,
    ...transitionProps
  }: Readonly<
    Props<P>
  >,
): ReactElement {
  const _ref = useRef<Element>(null);
  const ref = hasRef<Element>(children) && !isNil(children.ref)
    ? hasRefObject(children) ? children.ref : (() => {
      throw Error(
        "[atomic-ui] Supported ref is only RefObject now. Remove ref from child",
      );
    })()
    : _ref;

  const returnValue = useTransition(
    { target: ref, isShow, immediate },
    transitionProps,
    [isShow, immediate, JSON.stringify(transitionProps)],
  );
  const { className, isCompleted, isActivated } = returnValue;
  const cls = useMemo<string>(
    () => {
      const _className = children.props.className;
      const _ =
        isNil(_className) || isString(_className) || isNumber(_className)
          ? _className
          : undefined;
      return joinChars([className, _], " ");
    },
    [className],
  );

  const mergedProps = useMemo<Partial<P>>(
    () => ({ ...children.props, className: cls, ref }),
    [cls],
  );

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
    mergedProps,
  });
}
