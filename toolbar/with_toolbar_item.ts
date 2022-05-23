// This module is browser compatible.

import { cloneElement, ReactElement, useContext } from "react";
import { mergeProps, omitRef } from "../util.ts";
import { isFunction } from "../deps.ts";
import useMergedRef from "../hooks/use_merged_ref.ts";
import { ActiveElementContext, RefsContext } from "./context.ts";
import {
  ATOMIC_UI,
  REF_CALLBACK_IS_NOT_SUPPORTED,
} from "../_shared/constant.ts";
import useToolbarItem, {
  Attributes,
  Contexts,
  Options,
} from "./use_toolbar_item.ts";

const ERROR_MSG = `${ATOMIC_UI} Must be wrapped by <ToolbarProvider>`;

export type Props = {
  children:
    | ReactElement
    | ((attributes: Attributes, contexts: Contexts) => ReactElement);
} & Partial<Options>;

export default function WithToolbarItem(
  { children, onKey, keyEntries }: Readonly<Props>,
): JSX.Element | never {
  const refs = useContext(RefsContext);
  const activeElementContext = useContext(ActiveElementContext);

  if (!refs || !activeElementContext) {
    throw Error(ERROR_MSG);
  }
  const [_, ref] = useMergedRef<HTMLElement | SVGElement>(children);
  if (isFunction(ref)) {
    throw Error(REF_CALLBACK_IS_NOT_SUPPORTED);
  }
  const [attributes, context] = useToolbarItem({
    refs,
    ref,
    activeElementStateSet: activeElementContext,
  }, {
    onKey,
    keyEntries,
  });

  const child = isFunction(children)
    ? children(attributes, context)
    : cloneElement(children, mergeProps(omitRef(children.props), attributes));

  return child;
}
