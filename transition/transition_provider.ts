import { useEffect } from "react";
import useTransition, {
  Param,
  ReturnValue as UseTransitionReturnValue,
} from "./use_transition.ts";
import { TransitionProps } from "./types.ts";

export type Props =
  & {
    /** The root child adapting transitions. */
    children: (state: UseTransitionReturnValue) => JSX.Element;

    /** Call on change transition states. */
    onChange?: (state: UseTransitionReturnValue) => void;
  }
  & Param
  & Partial<TransitionProps>;

/** Transition as `children` function.
 * ```tsx
 * import { useRef, useState } from "react";
 * import { TransitionProvider } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
 *
 * export default () => {
 *   const [isShow] = useState(false);
 *   const ref = useRef<HTMLDivElement>(null);
 *   return (
 *     <TransitionProvider
 *       enterFrom="opacity-0"
 *       enter="transition"
 *       leaveTo="opacity-0"
 *       leave="transition"
 *       leaved="opacity-0"
 *       duration={ref}
 *       isShow={isShow}
 *     >
 *       {({ className }) => {
 *         return <div ref={ref} className={className}>transition</div>;
 *       }}
 *     </TransitionProvider>
 *   );
 * };
 * ```
 */
export default function TransitionProvider(
  {
    children,
    duration,
    isShow,
    immediate = false,
    onChange,
    ...transitionProps
  }: Readonly<
    Props
  >,
): JSX.Element {
  const returnValue = useTransition(
    { duration, isShow, immediate },
    transitionProps,
    [isShow, immediate, JSON.stringify(transitionProps)],
  );

  useEffect(() => {
    onChange?.(returnValue);
  }, [JSON.stringify(onChange), JSON.stringify(returnValue)]);

  return children(returnValue);
}
