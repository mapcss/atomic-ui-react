import {
  AllHTMLAttributes,
  createElement,
  forwardRef as _forwardRef,
  Fragment,
  Ref,
  useMemo,
} from "react";
import { Tag } from "../types.ts";
import { joinChars } from "../util.ts";
import WithTransition, {
  Props as WithTransitionProps,
} from "./with_transition.ts";

export type Props<As extends Tag> =
  & {
    /** The default tag.
     * @default `div`
     */
    as?: As;
  }
  & ({
    /** Whether unmount(remove DOM) at transition phase is leaved or not. */
    unmount?: true;

    /** Classes the leave phase is ended. */
    leaved?: undefined;
  } | {
    /** Whether unmount(remove DOM) at transition phase is leaved or not. */
    unmount?: false;

    /** Classes the leave phase is ended. */
    leaved?: string;
  })
  & Omit<WithTransitionProps, "children" | "leaved">
  & AllHTMLAttributes<Element>;

function _Transition<As extends Tag = "div">(
  {
    as = "div" as As,
    isShow,
    enter,
    enterFrom,
    enterTo,
    entered,
    leave,
    leaveFrom,
    leaveTo,
    leaved,
    unmount = true,
    immediate,
    children,
    className: _className,
    ...allAttributes
  }: Props<As>,
  ref: Ref<Element>,
): JSX.Element {
  const child = createElement(WithTransition, {
    children: ({ ref, className: cls }, { isShowable }) => {
      const className = useMemo<string | undefined>(
        () => joinChars([_className, cls], " "),
        [_className, cls],
      );

      const show = useMemo<boolean>(() => !unmount || isShowable, [
        isShowable,
        unmount,
      ]);

      return show
        ? createElement(as, { ref, className, ...allAttributes }, children)
        : createElement(Fragment);
    },
    isShow,
    enter,
    enterFrom,
    enterTo,
    entered,
    leave,
    leaveFrom,
    leaveTo,
    leaved,
    immediate,
    ref,
  });

  return child;
}

/** The transition component lets you add `enter`/`leave` transitions.
 * ```tsx
 * import { Transition } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
 * import { useState } from "react";
 *
 * export default () => {
 *   const [isShow, setIsShow] = useState(false);
 *   return (
 *     <Transition
 *       isShow={isShow}
 *       enter="transition duration-300"
 *       enterFrom="opacity-0"
 *       leave="transition"
 *       leaved="opacity-0"
 *     >
 *       root
 *     </Transition>
 *   );
 * };
 * ```
 */
const Transition = _forwardRef(_Transition);
export default Transition;

declare module "react" {
  // deno-lint-ignore ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: Ref<T>) => ReactElement | null,
  ): (props: P & RefAttributes<T>) => ReactElement | null;
}
