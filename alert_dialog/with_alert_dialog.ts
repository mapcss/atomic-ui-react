// This module is browser compatible.

import {
  cloneElement,
  createElement,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import useAriaAlertDialog, {
  ReturnValue as UseAriaAlertDialog,
} from "./use_aria_alert_dialog.ts";
import { isFunction } from "../deps.ts";
import { KeyboardEventHandler } from "../types.ts";
import useId from "../hooks/use_id.ts";
import { IdMapContext, RenderContextContext } from "./context.ts";
import { joinChars } from "../util.ts";
import { HasFocusElement } from "../_shared/types.ts";
import useKeyboardEventHandler, {
  KeyOrCodeOrKeyboardEvent,
} from "../hooks/use_keyboard_event_handler.ts";
import useEventListener from "../hooks/use_event_listener.ts";
import useChildRef from "../hooks/use_child_ref.ts";
import useFocusCallback from "./use_focus_callback.ts";
import { RenderContext } from "./types.ts";

export type Props = {
  children:
    | ReactElement
    | ((
      attributes: UseAriaAlertDialog,
      context: RenderContext,
    ) => ReactElement);

  isShow: boolean;

  /** Initial focus element */
  initialFocus?: () => HasFocusElement | undefined | null;

  /**
   * - `focus-prev` - Focus on the focusable element before the currently active element.
   * - `focus-next` - Focus on the focusable element after the currently active element.
   * @default [[{ code: "Tab", shiftKey: true }, "focus-prev"],["Tab", "focus-next"]]
   */
  keyEntries?: KeyEntries;
};
export default function WithAlertDialog(
  { children, isShow, initialFocus, keyEntries = defaultKeyEntries }: Readonly<
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

  useEffect(() => {
    const el = initialFocus?.();
    if (!isShow || !el) return;
    el.focus();
  }, [isShow, initialFocus]);

  const { focusNext, focusPrev } = useFocusCallback(refCurrent);
  const renderContext = useMemo<RenderContext>(
    () => ({ isShow, focusPrev, focusNext }),
    [isShow, focusPrev, focusNext],
  );
  const _child = isFunction(children)
    ? children(aria, renderContext)
    : cloneElement(children, aria);

  const entries = useMemo<[KeyOrCodeOrKeyboardEvent, KeyboardEventHandler][]>(
    () => {
      const interactiveTypeMap: InteractiveTypeMap = {
        "focus-prev": focusPrev,
        "focus-next": focusNext,
      };

      return mapping(keyEntries, interactiveTypeMap);
    },
    [focusPrev, focusNext, JSON.stringify(keyEntries)],
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
      RenderContextContext.Provider,
      { value: renderContext },
      child,
    ),
  );
}

type InteractiveType = "focus-prev" | "focus-next";

type KeyEntries = Iterable<
  [
    KeyOrCodeOrKeyboardEvent,
    InteractiveType | KeyboardEventHandler,
  ]
>;

export const defaultKeyEntries: KeyEntries = [
  [{ code: "Tab", shiftKey: true }, "focus-prev"],
  ["Tab", "focus-next"],
];

type InteractiveTypeMap = Record<InteractiveType, KeyboardEventHandler>;

function mapping(
  keyEntries: KeyEntries,
  record: InteractiveTypeMap,
): [KeyOrCodeOrKeyboardEvent, KeyboardEventHandler][] {
  return Array.from(keyEntries).map(([keyOr, map]) => {
    if (isFunction(map)) {
      return [keyOr, map];
    }

    return [keyOr, record[map]];
  });
}
