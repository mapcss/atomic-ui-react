// This module is browser compatible.

import {
  cloneElement,
  createElement,
  ReactElement,
  useCallback,
  useMemo,
} from "react";
import useAriaAlertDialog, {
  ReturnValue as UseAriaAlertDialog,
} from "./use_aria_alert_dialog.ts";
import { isFunction } from "../deps.ts";
import useId from "../hooks/use_id.ts";
import { ContextContext, IdMapContext } from "./context.ts";
import { joinChars } from "../util.ts";
import useKeyboardEventHandler, {
  KeyEntries,
} from "../hooks/use_keyboard_event_handler.ts";
import useEventListener from "../hooks/use_event_listener.ts";
import useChildRef from "../hooks/use_child_ref.ts";
import useFocusCallback from "./use_focus_callback.ts";
import { Context } from "./types.ts";

export type Props = {
  children:
    | ReactElement
    | ((
      attributes: UseAriaAlertDialog,
      context: Context,
    ) => ReactElement);

  isShow: boolean;

  /**
   * @defaultValue {@link defaultKeyEntries}
   */
  keyEntries?: (context: Context) => KeyEntries;
};
export default function WithAlertDialog(
  { children, isShow, keyEntries = defaultKeyEntries }: Readonly<
    Props
  >,
): JSX.Element {
  const id = useId();
  const title = useMemo<string>(
    () => joinChars([id, "alert", "dialog", "title"], "-")!,
    [id],
  );
  const describe = useMemo<string>(
    () => joinChars([id, "alert", "dialog", "describe"], "-")!,
    [id],
  );
  const aria = useAriaAlertDialog({ titleId: title, describeId: describe });
  const refCurrent = useCallback(() => getRef.current, []);

  const { focusNext, focusPrev } = useFocusCallback(refCurrent);
  const ctx = useMemo<Context>(
    () => ({ isShow, focusPrev, focusNext }),
    [isShow, focusPrev, focusNext],
  );
  const _child = isFunction(children)
    ? children(aria, ctx)
    : cloneElement(children, aria);

  const entries = useMemo<KeyEntries>(
    () => {
      return keyEntries(ctx);
    },
    [focusPrev, focusNext, keyEntries],
  );

  const target = useCallback(() => document, []);

  const keyboardHandler = useKeyboardEventHandler(entries);

  useEventListener(
    {
      target,
      event: "keydown",
      callback: keyboardHandler,
    },
    { use: isShow },
    [target, isShow, keyboardHandler],
  );

  const [getRef, setRef] = useChildRef(_child);
  const child = cloneElement(_child, { ref: setRef });

  return createElement(
    IdMapContext.Provider,
    { value: { title, describe } },
    createElement(
      ContextContext.Provider,
      { value: ctx },
      child,
    ),
  );
}

export const defaultKeyEntries: (context: Context) => KeyEntries = (
  { focusNext, focusPrev },
) => [
  [{ code: "Tab", shiftKey: true }, focusPrev],
  ["Tab", focusNext],
];
