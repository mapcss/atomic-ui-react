// deno-lint-ignore-file no-explicit-any
import {
  cloneElement,
  createElement,
  Fragment,
  ReactElement,
  RefObject,
  useMemo,
  useRef,
} from "react";
import { isFunction, isNil, isNumber, isString } from "../deps.ts";
import { joinChars, resolveRef } from "../util.ts";
import useTransition, {
  Param,
  ReturnValue as UseTransitionReturnValue,
} from "./use_transition.ts";
import { TransitionMap } from "./types.ts";

/** Context of rendering */
export type RenderContext =
  & UseTransitionReturnValue
  & Required<Pick<Props, "isShow" | "immediate">>;

type _Props<E extends Element = Element> = {
  /** The root child adapting transitions. */
  children:
    | ReactElement
    | ((
      attributes: Omit<Attributes<any>, "children">,
      context: RenderContext,
    ) => ReactElement);

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
  & Omit<Param, "duration">
  & Partial<TransitionMap>;

export type Attributes<E extends Element = Element> = {
  /** Root child adapting transitions. */
  children: ReactElement;

  /** The root child `RefObject` */
  ref: RefObject<E>;
} & Pick<UseTransitionReturnValue, "className">;

export default function WithTransition(
  {
    children,
    isShow,
    immediate = false,
    render = defaultRender,
    ...transitionProps
  }: Readonly<Props>,
): JSX.Element {
  const isRenderProps = isFunction(children);
  const _ref = useRef<Element>(null);
  const ref = isRenderProps ? _ref : resolveRef<Element>(children) ?? _ref;
  const returnValue = useTransition(
    {
      isShow,
      immediate,
      duration: ref,
    },
    transitionProps,
    [isShow, immediate, JSON.stringify(transitionProps)],
  );
  const context = useMemo<RenderContext>(() => ({
    ...returnValue,
    immediate,
    isShow,
  }), [isShow, immediate, JSON.stringify(returnValue)]);

  if (isRenderProps) {
    return children({ ref, className: returnValue.className }, context);
  }

  return render({ children, ref, className: returnValue.className }, context);
}

const defaultRender: Render = (
  { children, ref, className: _className },
  { isShowable },
): ReactElement => {
  const __className = useMemo<any>(() => children.props.className, [
    children.props.className,
  ]);

  const className = useMemo<string | undefined>(
    () => {
      const isValid = isValidClassName(__className);

      if (!isValid) {
        console.warn("[atomic-ui] Invalid className is ignored.");
      }

      const characters = isValid ? [__className, _className] : [_className];
      return joinChars(characters, " ");
    },
    [_className, __className],
  );

  return isShowable
    ? cloneElement(children, { ref, className })
    : createElement(Fragment);
};

function isValidClassName(
  value: unknown,
): value is number | string | undefined | null {
  return [isString, isNumber, isNil].some((fn) => fn(value));
}
