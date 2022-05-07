// deno-lint-ignore-file no-explicit-any
import {
  cloneElement,
  createElement,
  forwardRef,
  Fragment,
  ReactElement,
  Ref,
  RefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { isBoolean, isFunction, isNil, isNumber, isString } from "../deps.ts";
import {
  getRef,
  isRefObject as _isRefObject,
  joinChars,
  resolveRefObject,
} from "../util.ts";
import useTransition, {
  Param,
  ReturnValue as UseTransitionReturnValue,
} from "./use_transition.ts";
import useGroupTransition, {
  ReturnValue as UseGroupTransitionReturnValue,
} from "./use_group_transition.ts";
import { Context, RootContext } from "./context.ts";
import { TransitionMap } from "./types.ts";

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

/** Context of rendering */
export type RenderContext =
  & UseTransitionReturnValue
  & Required<Pick<Props, "immediate">>
  & UseGroupTransitionReturnValue;

type _Props<E extends Element = Element> = {
  /** The root child adapting transitions. */
  children:
    | ReactElement
    | ((
      attributes: Omit<Attributes<any>, "children">,
      context: RenderContext,
    ) => ReactElement);

  /** Call on change transition states. */
  onChange?: (state: UseTransitionReturnValue) => void;

  /** Controls the rendering element. Called just before rendering, it returns the element to actually render.
   * ```tsx
   * import { cloneElement } from "react"
   * import { WithTransition } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts"
   * export default () => {
   *   return (
   *     <WithTransition
   *       render={({ children, className, ref }) => {
   *         return cloneElement(children, { ref });
   *       }}
   *       isShow
   *     >
   *       <></>
   *     </WithTransition>
   *   );
   * };
   * ```
   * @default {@link defaultRender}
   */
  render?: Render<E>;
};

export type Render<E extends Element = Element> = (
  attributes: Attributes<E>,
  context: RenderContext,
) => ReactElement;

export type Props =
  & _Props
  & Omit<Param, "duration" | "isShow">
  & Partial<TransitionMap>
  & ExclusiveOption;

export type Attributes<E extends Element = Element> = {
  /** Root child adapting transitions. */
  children: ReactElement;

  /** The root child `RefObject` */
  ref: RefObject<E>;
} & Pick<UseTransitionReturnValue, "className">;

/** Component to automatically adapt transitions to the root child.
 * ```tsx
 * import { WithTransition } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
 * export default () => {
 *   return (
 *     <WithTransition
 *       enter="transition duration-300"
 *       enterFrom="opacity-0"
 *       leave="transition duration-300"
 *       leaveTo="opacity-0"
 *       isShow
 *     >
 *       <div />
 *     </WithTransition>
 *   );
 * };
 * ```
 */
function _WithTransition(
  {
    children,
    isShow: _isShow,
    isRoot = true,
    immediate: _immediate,
    onChange,
    render = defaultRender,
    ...transitionProps
  }: Readonly<Props>,
  __ref: Ref<Element>,
): JSX.Element {
  const isRenderProps = isFunction(children);

  const _ref = useRef<Element>(null);
  const ref =
    resolveRefObject(__ref, isRenderProps ? undefined : getRef(children)) ??
      _ref;

  const rootContext = useContext(RootContext);

  const immediate = useMemo<boolean>(() => {
    if (isBoolean(_immediate)) return _immediate;
    return rootContext?.isActivated ?? false;
  }, [_immediate, isRoot, rootContext?.isActivated]);

  const [_, setReturnValue] = useContext(Context);

  const isShow = useMemo<boolean>(() => {
    if (isBoolean(_isShow)) return _isShow;
    if (!isRoot) return rootContext?.isShow ?? false;

    throw Error("Either isShow or isRoot required");
  }, [isRoot, _isShow, rootContext?.isShow]);

  const returnValue = useTransition(
    {
      isShow,
      immediate,
      duration: ref,
    },
    transitionProps,
    [isShow, immediate, JSON.stringify(transitionProps)],
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

  const context = useMemo<RenderContext>(() => ({
    ...returnValue,
    ...useGroupTransitionReturnValue,
    immediate,
    isShow,
  }), [
    isShow,
    immediate,
    JSON.stringify(returnValue),
    JSON.stringify(useGroupTransitionReturnValue),
  ]);

  useEffect(() => {
    onChange?.(returnValue);
  }, [JSON.stringify(onChange), JSON.stringify(returnValue)]);

  const child = isRenderProps
    ? children({ ref, className: returnValue.className }, context)
    : render(
      { children, ref, className: returnValue.className },
      context,
    );

  const wrapper = isRoot
    ? createElement(
      RootContext.Provider,
      { value: { isRoot, isShow, ...returnValue } },
      createElement(
        Context.Provider,
        { value: childStateSet },
        child,
      ),
    )
    : child;

  return wrapper;
}

const defaultRender: Render = (
  { children, ref, className: _className },
  { isReady },
): ReactElement => {
  const __className = children.props.className;
  const isValid = isValidClassName(__className);
  if (!isValid) {
    console.warn("[atomic-ui] Invalid className is ignored.");
  }
  const characters = isValid ? [__className, _className] : [_className];
  const className = joinChars(characters, " ");

  return isReady
    ? cloneElement(children, { ref, className })
    : createElement(Fragment);
};

function isValidClassName(
  value: unknown,
): value is number | string | undefined | null {
  return [isString, isNumber, isNil].some((fn) => fn(value));
}

const WithTransition = forwardRef(_WithTransition);
export default WithTransition;
