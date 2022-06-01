import {
  ReactElement,
  RefAttributes,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import useListboxOption, { Returns } from "./use_listbox_option.ts";
import { CommonContextsContext, IdContext } from "./context.ts";
import useId from "../hooks/use_id.ts";
import { getIdPrefix } from "./util.ts";
import FocusStrategyContext from "../focus/context.ts";

export type Props = {
  children: (
    // deno-lint-ignore no-explicit-any
    attributes: Returns[0] & RefAttributes<any>,
    contexts: Returns[1],
  ) => ReactElement;
};
export default function WithListboxOption(
  { children }: Readonly<Props>,
): JSX.Element {
  const commonContexts = useContext(CommonContextsContext);
  const groupId = useContext(IdContext);
  const focusStrategy = useContext(FocusStrategyContext);

  if (
    !groupId || !commonContexts
  ) {
    throw Error();
  }
  const ref = useRef<HTMLElement | SVGElement | MathMLElement>(null);

  useEffect(() => {
    commonContexts.childrenRef.current.push(ref);
  }, []);
  const prefix = useMemo<string>(
    () => getIdPrefix(groupId),
    [groupId],
  );
  const { id, index } = useId({ prefix });

  const [attributes, contexts] = useListboxOption(
    { ...commonContexts, id, index },
    { focusStrategy },
  );

  return children({ ref, ...attributes }, contexts);
}
