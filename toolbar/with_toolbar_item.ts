// This module is browser compatible.

import {
  AllHTMLAttributes,
  ReactElement,
  RefAttributes,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { joinChars } from "../util.ts";
import {
  CommonContextsContext,
  FocusStrategyContext,
  IdContext,
} from "./context.ts";
import useToolbarItem, {
  AllAttributesWithContexts,
  Contexts,
} from "./use_toolbar_item.ts";
import useId from "../hooks/use_id.ts";
import { ERROR_MSG } from "./constants.ts";

export type Props = {
  children: (
    // deno-lint-ignore no-explicit-any
    attributes: AllHTMLAttributes<Element> & RefAttributes<any>,
    contexts: Contexts,
  ) => ReactElement;
} & Partial<AllAttributesWithContexts>;

export default function WithToolbarItem(
  { children, ...allAttributes }: Readonly<Props>,
): JSX.Element | never {
  const idReturns = useContext(IdContext);
  const commonContexts = useContext(CommonContextsContext);
  const focusStrategy = useContext(FocusStrategyContext);

  if (!idReturns || !commonContexts) {
    throw Error(ERROR_MSG);
  }
  const ref = useRef<HTMLElement | SVGElement>(null);
  const prefix = useMemo<string>(
    () => joinChars([idReturns.id, "toolbar", "item"], "-")!,
    [idReturns.id],
  );
  const { id, index } = useId({ prefix });

  useEffect(() => {
    commonContexts.itemsRef.current?.push(ref);
  }, []);

  const ctx = useMemo(() => ({ id, index, ...commonContexts }), [
    commonContexts,
    id,
    index,
  ]);

  const [attributes, contexts] = useToolbarItem(
    ctx,
    { focusStrategy },
    allAttributes,
  );

  return children({ ref, ...attributes }, contexts);
}
