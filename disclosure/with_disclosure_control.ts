// This module is browser compatible.

import { cloneElement, ReactElement, useContext, useMemo } from "react";
import { isFunction, ValueOf } from "../deps.ts";
import { BooleanContext, IdContext } from "../_shared/context.ts";
import { mergeProps } from "../util.ts";
import { ERROR_MSG } from "./constant.ts";
import { DispatchMap } from "./types.ts";
import useDisclosureControl, {
  Attributes,
  Contexts,
  Options,
} from "./use_disclosure_control.ts";

type Type = "toggle" | "open" | "close";

export type Props = {
  /**
   * @defaultValue `toggle`
   */
  type?: Type;

  children:
    | ReactElement
    | ((
      attributes: Attributes,
      contexts: Contexts,
    ) => JSX.Element);
} & Partial<Options>;

export default function WithDisclosureControl(
  { on, onKey, type = "toggle", keyEntries, children }: Readonly<Props>,
): JSX.Element | never {
  const id = useContext(IdContext);
  const stateSet = useContext(BooleanContext);

  if (!stateSet) throw Error(ERROR_MSG);

  const [isOpen, { on: open, off: close, toggle }] = stateSet;
  const dispatch = useMemo<ValueOf<DispatchMap>>(() => {
    const dispatches: DispatchMap = { open, close, toggle };
    return dispatches[type];
  }, [
    type,
    open,
    close,
    toggle,
  ]);

  const [attributes, contexts] = useDisclosureControl({
    isOpen,
    id,
    dispatch,
  }, {
    on,
    onKey,
    keyEntries,
  });

  const child = isFunction(children)
    ? children(attributes, contexts)
    : cloneElement(
      children,
      mergeProps(children.props, attributes),
    );

  return child;
}
