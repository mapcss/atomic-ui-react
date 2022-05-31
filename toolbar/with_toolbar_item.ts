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
  ActiveIndexStateSetContext,
  IdContext,
  ItemsRefContext,
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
  const itemsRef = useContext(ItemsRefContext);
  const activeIndexStateSet = useContext(ActiveIndexStateSetContext);

  if (!idReturns || !itemsRef || !activeIndexStateSet) {
    throw Error(ERROR_MSG);
  }
  const ref = useRef<HTMLElement | SVGElement>(null);
  const prefix = useMemo<string>(
    () => joinChars([idReturns.id, "toolbar", "item"], "-")!,
    [idReturns.id],
  );
  const { id, index } = useId({ prefix });

  useEffect(() => {
    itemsRef.current?.push(ref);
  }, []);

  const [activeIndex, setActiveIndex] = activeIndexStateSet;
  const [attributes, contexts] = useToolbarItem({
    itemsRef,
    id,
    index,
    activeIndex,
    setActiveIndex,
  }, allAttributes);

  return children({ ref, ...attributes }, contexts);
}
