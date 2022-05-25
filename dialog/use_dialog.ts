// This module is browser compatible.

import { AllHTMLAttributes, useCallback, useMemo } from "react";
import { VFn } from "../deps.ts";
import useFocusCallback, {
  ReturnValue as UseFocusCallbackReturnValue,
  Targets,
} from "../hooks/use_focus_callback.ts";
import useKeyboardEventHandler, {
  KeyEntries,
} from "../hooks/use_keyboard_event_handler.ts";
import useEventListener from "../hooks/use_event_listener.ts";
import useFocus, { Target } from "../hooks/use_focus.ts";
import { trueOr } from "../util.ts";

export type Params = {
  isShow: boolean;

  targets: Targets;
};

export type Options = {
  /** Called when the dialog is dismissed */
  onClose: VFn;

  keyEntries: (contexts: Contexts) => KeyEntries;

  /** A function for return element that should receive focus first.
   * This function is executed on the client side.
   */
  initialFocus: Target;

  titleId: string;

  describeId: string;
};

export type Attributes = Pick<
  AllHTMLAttributes<Element>,
  "role" | "aria-modal" | "aria-labelledby" | "aria-describedby" | "hidden"
>;

export type Contexts = UseFocusCallbackReturnValue & {
  /** Call `onClose` callback */
  close?: VFn;
};
export type Returns = [Attributes, Contexts];

export default function useAriaAlertDialog(
  { isShow, targets }: Readonly<Params>,
  {
    onClose,
    keyEntries = defaultKeyEntries,
    initialFocus: _initialFocus,
    titleId,
    describeId,
  }: Readonly<
    Partial<Options>
  > = {},
): Returns {
  const defaultInitialFocus = useCallback<Target>(() => {
    const els = targets();
    return Array.from(els)[0];
  }, [targets]);
  const initialFocus = _initialFocus ?? defaultInitialFocus;

  const { focusFirst, focusLast, focusNext, focusPrev } = useFocusCallback(
    targets,
  );
  const contexts = useMemo<Contexts>(() => ({
    focusFirst,
    focusLast,
    focusNext,
    focusPrev,
    close: onClose,
  }), [focusFirst, focusLast, focusNext, focusPrev, onClose]);

  useFocus(initialFocus, { use: isShow }, [initialFocus, isShow]);

  const attributes = useMemo<Attributes>(() => ({
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": titleId,
    "aria-describedby": describeId,
    hidden: trueOr(!isShow),
  }), [titleId, describeId, isShow]);

  const entries = useMemo<KeyEntries>(() => keyEntries(contexts), [keyEntries]);
  const keyboardHandler = useKeyboardEventHandler(entries);

  const target = useCallback(() => document, []);

  useEventListener({
    target,
    event: "keydown",
    callback: keyboardHandler,
  }, {
    use: isShow,
  }, [
    target,
    isShow,
    keyboardHandler,
  ]);

  return [attributes, contexts];
}

function defaultKeyEntries(
  { focusNext, focusPrev, close }: Contexts,
): KeyEntries {
  return [
    [{ code: "Tab", shiftKey: true }, (ev) => {
      ev.preventDefault();
      focusPrev();
    }],
    ["Tab", (ev) => {
      ev.preventDefault();
      focusNext();
    }],
    ["Escape", (ev) => {
      ev.preventDefault();
      close?.();
    }],
  ];
}
