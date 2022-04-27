// This module is browser compatible.

import {
  cloneElement,
  createElement,
  Fragment,
  ReactElement,
  RefObject,
  useContext,
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

export type RenderParam<E extends Element = Element> = {
  /** Root child adapting transitions. */
  children: ReactElement;

  /** The root child `RefObject` */
  ref: RefObject<E>;
};

type ExclusiveOption =
  | {
    isShow: boolean;

    /** Whether this component is transition root or not. */
    isRoot?: true | never;
  }
  | {
    isShow?: never;

    /** Whether this component is transition root or not. */
    isRoot: false;
  };

export type Props<E extends Element = Element> =
  & Omit<_Props, "children" | "duration" | "isShow">
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
  }
  & ExclusiveOption;

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
    isShow: _isShow,
    immediate: _immediate,
    onChange,
    render = defaultRender,
    isRoot: _isRoot,
    ...transitionProps
  }: Readonly<Props<E>>,
): ReactElement {
  const _ref = useRef<E>(null);
  const ref = resolveRef<E>(children) ?? _ref;

  const sharedIsShow = useContext(IsShowContext);
  const [_, setReturnValue] = useContext(Context);

  const isRoot = useMemo<boolean>(() => _isRoot ?? isBoolean(_isShow), [
    _isRoot,
    _isShow,
  ]);
  const immediate = useMemo<boolean>(() => {
    if (isBoolean(_immediate)) return _immediate;
    return !isRoot;
  }, [_immediate, isRoot]);
  const isShow = useMemo<boolean>(() => {
    if (!isRoot) return sharedIsShow;
    if (isBoolean(_isShow)) return _isShow;

    throw Error("Either isShow or isRoot required");
  }, [isRoot, _isShow, sharedIsShow]);

  const transitionPropsStr = JSON.stringify(transitionProps);
  const returnValue = useTransition(
    { duration: ref, isShow, immediate },
    transitionProps,
    [isShow, immediate, transitionPropsStr],
  );

  useEffect(() => {
    if (isRoot) return;
    setReturnValue(returnValue);
  }, [isRoot, JSON.stringify(returnValue)]);

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

  const child = render({
    children,
    ref,
  }, {
    ...returnValue,
    ...useGroupTransitionReturnValue,
    isShow,
    immediate,
    isRoot,
  });

  const wrapper = isRoot
    ? createElement(
      IsShowContext.Provider,
      { value: isShow },
      createElement(
        Context.Provider,
        { value: childStateSet },
        child,
      ),
    )
    : child;

  return wrapper;
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

const defaultRender: Render = (
  { children, ref },
  { isReady },
): ReactElement => {
  return isReady ? cloneElement(children, { ref }) : createElement(Fragment);
};
