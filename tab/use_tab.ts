// This module is browser compatible.

import { AllHTMLAttributes, useCallback, useMemo } from "react";
import {
  AllHandlerMap,
  AllHandlerWithoutKeyBoard,
  KeyboardHandler,
} from "../types.ts";
import { TAB } from "./constant.ts";
import useKeyboardEventListener, {
  KeyEntries,
} from "../hooks/use_keyboard_event_handler.ts";
import { useEventHandler } from "../_shared/hooks.ts";
import useFocusCallback, {
  ReturnValue as UseFocusCallbackReturnValue,
  Targets,
} from "../hooks/use_focus_callback.ts";
import { isAriaDisabled } from "./assert.ts";
import { booleanish, onNotNullable } from "../util.ts";

export type Params = {
  index: number;

  targets: Targets;
};

export type ChangeEventHandler = (
  context: ChangeEventContexts,
) => void;

export type ChangeEventContexts = {
  featureIndex: number;
  target: HTMLElement | SVGElement | MathMLElement;
};

export type Options = {
  /** Whether or not the tab is disabled. */
  isDisabled: boolean;

  on: Readonly<Iterable<AllHandlerWithoutKeyBoard>>;

  onKey: Readonly<Iterable<KeyboardHandler>>;

  /**
   * @defaultValue {@link defaultKeyEntries}
   */
  keyEntries: (contexts: Contexts) => KeyEntries;

  tabId: string;

  tabPanelId: string;

  /** Whether or not the tab is selected. */
  isSelected: boolean;

  isHorizontal: boolean;

  /**
   * Call on the future element has not `aria-disabled`.
   */
  onChange: ChangeEventHandler;
};

export type Attributes =
  & Pick<
    AllHTMLAttributes<Element>,
    | "role"
    | "id"
    | "aria-selected"
    | "aria-disabled"
    | "aria-controls"
    | "tabIndex"
  >
  & AllHandlerMap;

export type Contexts = {
  isHorizontal: boolean;
} & UseFocusCallbackReturnValue;

export type Returns = [Attributes, Contexts];

export default function useTab(
  {
    index,
    targets,
  }: Readonly<Params>,
  {
    on = ["onClick"],
    onKey = ["onKeyDown"],
    keyEntries = defaultKeyEntries,
    isDisabled = false,
    onChange,
    tabId,
    tabPanelId,
    isSelected,
    isHorizontal = true,
  }: Readonly<Partial<Options>> = {},
): Returns {
  const onBeforeChange = useCallback((featureIndex: number): void => {
    const els = targets();
    const target = Array.from(els)[featureIndex];
    if (!isAriaDisabled(target)) {
      onChange?.({ featureIndex, target });
    }
  }, [targets, onChange]);

  const callbacks = useFocusCallback(targets);

  const contexts = useMemo<Contexts>(() => ({
    isHorizontal,
    ...callbacks,
  }), [
    isHorizontal,
    callbacks.focusFirst,
    callbacks.focusLast,
    callbacks.focusNext,
    callbacks.focusPrev,
  ]);

  const entries = useMemo<KeyEntries>(() => keyEntries(contexts), [
    keyEntries,
    contexts,
  ]);
  const keyboardHandler = useKeyboardEventListener(entries);
  const keyboardHandlers = useEventHandler(onKey, keyboardHandler);

  const handlers = useEventHandler(on, () => onBeforeChange(index));
  const attributes = useMemo<Attributes>(() => ({
    role: TAB,
    id: tabId,
    "aria-selected": onNotNullable(isSelected, booleanish),
    "aria-disabled": onNotNullable(isDisabled, booleanish),
    "aria-controls": tabPanelId,
    ...handlers,
    ...keyboardHandlers,
  }), [tabId, tabPanelId, isSelected, isDisabled]);

  return [attributes, contexts];
}

export function defaultKeyEntries(
  { isHorizontal, focusPrev, focusNext, focusFirst, focusLast }: Contexts,
): KeyEntries {
  const statics: KeyEntries = [
    ["Home", focusFirst],
    ["PageUp", focusFirst],
    ["End", focusLast],
    ["PageDown", focusLast],
  ];
  const dynamics: KeyEntries = isHorizontal
    ? [["ArrowLeft", focusPrev], ["ArrowRight", focusNext]]
    : [["ArrowUp", focusPrev], ["ArrowDown", focusNext]];

  return [...statics, ...dynamics];
}
