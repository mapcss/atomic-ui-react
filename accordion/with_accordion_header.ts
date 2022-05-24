// This module is browser compatible.

import {
  cloneElement,
  ReactElement,
  RefAttributes,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { isFunction, VFn } from "../deps.ts";
import { current, filterTruthy, mergeProps, omitRef } from "../util.ts";
import {
  HeaderCountContext,
  IdContext,
  IndexContext,
  RefsContext,
} from "./context.ts";
import useMergedRef from "../hooks/use_merged_ref.ts";
import useAccordionHeader, {
  Attributes,
  Contexts,
  Options,
} from "./use_accordion_header.ts";
import { ERROR_MSG } from "./constant.ts";

export type Props = {
  children:
    | ReactElement
    | ((
      // deno-lint-ignore no-explicit-any
      attributes: Attributes & RefAttributes<any>,
      contexts: Contexts,
    ) => ReactElement);
} & Partial<Options>;

export default function WithAccordionHeader(
  {
    children,
    on,
    onKey,
    keyEntries,
  }: Readonly<Props>,
): JSX.Element | never {
  const id = useContext(IdContext);
  const selectedIndexStateSet = useContext(IndexContext);
  const tempId = useContext(HeaderCountContext);
  const refs = useContext(RefsContext);

  if (!id || !selectedIndexStateSet || !tempId) throw Error(ERROR_MSG);

  const [selectedIndex, setSelectedIndex] = selectedIndexStateSet;
  const index = tempId.next;

  const isOpen = useMemo<boolean>(() => index === selectedIndex, [
    index,
    selectedIndex,
  ]);

  const targets = useCallback(() => filterTruthy(refs.map(current)), []);
  const open = useCallback<VFn>(() => setSelectedIndex(index), [
    setSelectedIndex,
    index,
  ]);

  const [attributes, contexts] = useAccordionHeader({
    isOpen,
    id,
    index,
    targets,
    open,
  }, {
    on,
    onKey,
    keyEntries,
  });

  const [getRef, ref] = useMergedRef<HTMLElement | SVGElement>(children);
  refs.push(getRef);

  const child = isFunction(children)
    ? children({ ref, ...attributes }, contexts)
    : cloneElement(children, {
      ref,
      ...mergeProps(omitRef(children.props), attributes),
    });

  return child;
}
