// This module is browser compatible.

import {
  cloneElement,
  createElement,
  Fragment,
  ReactElement,
  useMemo,
  useRef,
} from "react";
import { isNil, isNumber, isString, joinChars } from "../deps.ts";
import useTransition, { Param, TransitionProps } from "./use_transition.ts";

export type Props =
  & {
    /** Root child adapting transitions. */
    children: ReactElement;
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
  { children, isShow, ...rest }: Readonly<Props>,
): ReactElement {
  const ref = useRef();
  const { className, isRendered } = useTransition(
    { target: ref, isShow },
    rest,
  );
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

  return isRendered
    ? cloneElement(children, { ref, className: cls })
    : createElement(Fragment);
}
