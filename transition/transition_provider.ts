// This module is browser compatible.

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
import useTransition, { Param, ReturnValue } from "./use_transition.ts";
import { isShowable } from "./util.ts";
import { TransitionProps } from "./types.ts";

export type Props =
  & {
    /** Root child adapting transitions. */
    children: ReactElement;

    /** Call on change transition states. */
    onChange?: (state: ReturnValue) => void;
  }
  & Pick<Param, "isShow">
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
export default function TransitionProvider(
  { children, isShow, onChange, ...rest }: Readonly<Props>,
): ReactElement {
  const ref = useRef<Element>(null);
  const returnValue = useTransition(
    { target: ref, isShow },
    rest,
  );
  const { className, isCompleted } = returnValue;
  const cls = useMemo<string>(
    () => {
      const _className = children.props.className;
      const _ =
        isNil(_className) || isString(_className) || isNumber(_className)
          ? _className
          : undefined;
      return joinChars([className, _], " ");
    },
    [className, children],
  );

  const _isShowable = useMemo<boolean>(
    () => isShowable(isShow, isCompleted),
    [isShow, isCompleted],
  );

  useEffect(() => {
    onChange?.(returnValue);
  }, [onChange, returnValue]);

  const child = useMemo<ReactElement>(() => {
    return _isShowable
      ? cloneElement(children, { ref, className: cls })
      : createElement(Fragment);
  }, [_isShowable, children, cls]);

  return child;
}
