// This module is browser compatible.

import { cloneElement, ReactElement, useContext, useMemo } from "react";
import { isFunction, ValueOf } from "../deps.ts";
import { BooleanContext, IdContext } from "../_shared/context.ts";
import { useEventHandler } from "../_shared/hooks.ts";
import { mergeProps } from "../util.ts";
import { AllHandler, AllHandlerMap } from "../types.ts";
import useAriaDisclosureControl, {
  ReturnValue as UseAriaDisclosureControlReturnValue,
} from "./use_aria_disclosure_control.ts";
import { ERROR_MSG } from "./constant.ts";
import { DispatchMap, StateMap } from "./types.ts";

type Type = "toggle" | "open" | "close";

export type Props = {
  on?: Iterable<AllHandler>;

  type?: Type;

  children:
    | ReactElement
    | ((
      attributes: UseAriaDisclosureControlReturnValue & AllHandlerMap,
      context: StateMap & DispatchMap,
    ) => JSX.Element);
};

export default function WithDisclosureControl(
  { on = ["onClick"], type = "toggle", children }: Readonly<Props>,
): JSX.Element {
  const id = useContext(IdContext);
  const stateSet = useContext(BooleanContext);

  if (!stateSet) throw Error(ERROR_MSG);

  const [isOpen, { on: open, off: close, toggle }] = stateSet;
  const stateMap: StateMap = { isOpen, id };
  const dispatchMap: DispatchMap = { open, close, toggle };
  const dispatch = useMemo<ValueOf<DispatchMap>>(() => dispatchMap[type], [
    type,
  ]);

  const aria = useAriaDisclosureControl(stateMap);
  const handlerMap = useEventHandler(on, dispatch);

  if (isFunction(children)) {
    return children({ ...aria, ...handlerMap }, {
      ...stateMap,
      ...dispatchMap,
    });
  }

  return cloneElement(
    children,
    mergeProps(children.props, { ...aria, ...handlerMap }),
  );
}
