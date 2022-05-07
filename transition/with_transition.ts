import {
  cloneElement,
  createElement,
  Fragment,
  ReactElement,
  RefObject,
  useMemo,
  useRef,
} from "react";
import { isNil, isNumber, isString, joinChars } from "../deps.ts";
import { resolveRef } from "../util.ts";
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
  children: ReactElement;

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

  className: string | undefined;

  /** The root child `RefObject` */
  ref: RefObject<E>;
};

export default function WithTransition(
  {
    children,
    isShow,
    immediate = false,
    render = defaultRender,
    ...transitionProps
  }: Props,
): JSX.Element {
  const ref = useMergedRef<Element>(children);
  const returnValue = useTransition(
    {
      isShow,
      immediate,
      duration: ref,
    },
    transitionProps,
    [isShow, immediate, JSON.stringify(transitionProps)],
  );

  // deno-lint-ignore no-explicit-any
  const _className = useMemo<any>(() => children.props.className, [
    children.props.className,
  ]);

  const className = useMemo<string | undefined>(
    () => {
      const isValid = isValidClassName(_className);

      if (!isValid) {
        console.warn("[atomic-ui] Invalid className is ignored.");
      }

      const characters = isValid
        ? [_className, returnValue.className]
        : [returnValue.className];
      return joinChars(characters, " ");
    },
    [returnValue.className, _className],
  );

  const attributes = useMemo<Attributes<Element>>(
    () => ({ className, children, ref }),
    [
      className,
      children,
    ],
  );
  const context = useMemo<RenderContext>(() => ({
    ...returnValue,
    immediate,
    isShow,
  }), [isShow, immediate, JSON.stringify(returnValue)]);

  return render(attributes, context);
}

function useMergedRef<E>(el: ReactElement): RefObject<E> | never {
  const _ref = useRef<E>(null);
  const ref = resolveRef<E>(el) ?? _ref;

  return ref;
}

const defaultRender: Render = (
  { children, ref, className },
  { isShowable },
): ReactElement => {
  return isShowable
    ? cloneElement(children, { ref, className })
    : createElement(Fragment);
};

function isValidClassName(
  value: unknown,
): value is number | string | undefined | null {
  return [isString, isNumber, isNil].some((fn) => fn(value));
}
