import {
  forwardRef as _forwardRef,
  ReactElement,
  Ref,
  RefAttributes,
  useCallback,
} from "react";
import useTransition, { Returns } from "./use_transition.ts";
import { Params } from "./use_transition_contexts.ts";
import { useMergedRef } from "../hooks/mod.ts";
import { Transitions } from "./types.ts";

export type Props =
  & {
    /** Render children with props. */
    children: (
      // deno-lint-ignore no-explicit-any
      attributes: Returns[0] & RefAttributes<any>,
      contexts: Returns[1],
    ) => ReactElement;

    /** Whether the component should be shown or hidden. */
    isShow: boolean;
  }
  & Omit<Params, "duration" | "isEnter">
  & Partial<Transitions>;

function _WithTransition(
  {
    children,
    immediate,
    isShow: isEnter,
    ...transitions
  }: Readonly<Props>,
  ref: Ref<Element>,
): JSX.Element {
  const [getRef, setRef] = useMergedRef(ref);
  const duration = useCallback(() => getRef.current, []);

  const [attributes, contexts] = useTransition({
    immediate,
    isEnter,
    duration,
  }, transitions);

  return children({ ref: setRef, ...attributes }, contexts);
}

const WithTransition = _forwardRef(_WithTransition);

export default WithTransition;
