// This module is browser compatible.

import { AllHTMLAttributes, useCallback, useMemo } from "react";
import { joinChars } from "../util.ts";
import useFocusCallback, {
  ReturnValue as UseFocusCallbackReturnValue,
  Targets,
} from "../hooks/use_focus_callback.ts";
import useKeyboardEventHandler, {
  KeyEntries,
} from "../hooks/use_keyboard_event_handler.ts";
import useEventListener from "../hooks/use_event_listener.ts";
import useFocus, { Target } from "../hooks/use_focus.ts";

export type Params = {
  id: string;

  isShow: boolean;

  targets: Targets;
};

export type Options = {
  keyEntries: (contexts: Contexts) => KeyEntries;

  /** A function for return element that should receive focus first.
   * This function is executed on the client side.
   */
  initialFocus: Target;
};

export type Attributes = Pick<
  AllHTMLAttributes<Element>,
  "role" | "aria-modal" | "aria-labelledby" | "aria-describedby"
>;

export type Contexts = UseFocusCallbackReturnValue;
export type Returns = [Attributes, Contexts];

export default function useAriaAlertDialog(
  { id, isShow, targets }: Readonly<Params>,
  {
    keyEntries = defaultKeyEntries,
    initialFocus: _initialFocus,
  }: Readonly<
    Partial<Options>
  > = {},
): Returns {
  const titleId = useMemo<string>(
    () => joinChars([id, "alert", "dialog", "title"], "-")!,
    [id],
  );
  const describeId = useMemo<string>(
    () => joinChars([id, "alert", "dialog", "describe"], "-")!,
    [id],
  );

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
  }), [focusFirst, focusLast, focusNext, focusPrev]);

  useFocus(initialFocus, { use: isShow }, [initialFocus, isShow]);

  const attributes = useMemo<Attributes>(() => ({
    role: "alertdialog",
    "aria-modal": "true",
    "aria-labelledby": titleId,
    "aria-describedby": describeId,
  }), [titleId, describeId]);

  const entries = useMemo<KeyEntries>(() => keyEntries(contexts), [keyEntries]);
  const keyboardHandler = useKeyboardEventHandler(entries);

  const target = useCallback(() => window, []);

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

function defaultKeyEntries({ focusNext, focusPrev }: Contexts): KeyEntries {
  return [
    [{ code: "Tab", shiftKey: true }, (ev) => {
      ev.preventDefault();
      focusPrev();
    }],
    ["Tab", (ev) => {
      ev.preventDefault();
      focusNext();
    }],
  ];
}
