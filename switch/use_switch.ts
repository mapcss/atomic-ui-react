// This module is browser compatible.

import { AllHTMLAttributes, useCallback, useMemo } from "react";
import {
  AllHandlerMap,
  HandlersWithContext,
  HandlerWithContext,
} from "../types.ts";
import useEventHandlersWithContext from "../_shared/use_event_handlers_with_context.ts";
import { mappingKey } from "../util.ts";

export type Params = {
  /** Whether or not the switch is checked. */
  isChecked: boolean;

  /** The function to call when the switch is toggled. */
  onValueChange: (isChecked: boolean) => void;
};

export type CallbackContexts = {
  toggle: () => void;
};

export type Contexts = CallbackContexts;

export type Options = HandlersWithContext<Contexts>;

export type Attributes =
  & Pick<
    AllHTMLAttributes<Element>,
    "role" | "aria-checked" | "tabIndex"
  >
  & AllHandlerMap;

export type Returns = [Attributes, Contexts];

export default function useSwitch(
  { isChecked, onValueChange }: Readonly<Params>,
  {
    ...handlerWithContext
  }: Readonly<
    Partial<Options>
  > = {},
): Returns {
  const toggle = useCallback(() => onValueChange(!isChecked), [
    onValueChange,
    isChecked,
  ]);

  const contexts: Contexts = {
    toggle,
  };
  const onClick = useCallback<HandlerWithContext<Contexts, "onClick">>(
    defaultOnClick,
    [],
  );

  const onKeyDown = useCallback<HandlerWithContext<Contexts, "onKeyDown">>(
    defaultOnKeyDown,
    [],
  );

  const handlers = useEventHandlersWithContext({
    handlers: { onClick, onKeyDown, ...handlerWithContext },
    context: contexts,
  });

  const attributes = useMemo<Attributes>(() => {
    return {
      role: "switch",
      "aria-checked": isChecked,
      tabIndex: 0,
      ...handlers,
    };
  }, [isChecked, ...Object.entries(handlers).flat()]);

  return [attributes, contexts];
}

const defaultOnKeyDown: HandlerWithContext<Contexts, "onKeyDown"> = (
  ev,
  { toggle },
) => {
  mappingKey([
    ["Space", (ev) => {
      ev.preventDefault();
      toggle();
    }],
    ["Enter", (ev) => {
      ev.preventDefault();
      toggle();
    }],
  ])(ev as unknown as KeyboardEvent);
};

const defaultOnClick: HandlerWithContext<Contexts, "onClick"> = (
  _,
  { toggle },
) => toggle();
