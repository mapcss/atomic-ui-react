import {
  AllHTMLAttributes,
  RefAttributes,
  RefObject,
  useCallback,
  useMemo,
} from "react";
import { filterTruthy, isSameNode } from "../util.ts";
import { isLength0 } from "../deps.ts";
import { AllHandlerMap, KeyboardHandler } from "../types.ts";
import useKeyboardEventHandler, {
  KeyEntries,
} from "../hooks/use_keyboard_event_handler.ts";
import useFocusCallback, {
  ReturnValue as UseFocusCallbackReturnValue,
} from "../hooks/use_focus_callback.ts";
import { useEventHandler } from "../_shared/hooks.ts";
import { calcTabIndex } from "./util.ts";
import { ReturnValue as UseActiveElementReturnValue } from "../hooks/use_active_element.ts";

export type Attributes =
  & Pick<AllHTMLAttributes<Element>, "tabIndex">
  & AllHandlerMap
  // deno-lint-ignore no-explicit-any
  & RefAttributes<any>;

export type Context = UseFocusCallbackReturnValue & {
  isFirst: boolean;

  isActive: boolean;
};

export type Param = {
  refs: RefObject<HTMLElement | SVGElement | MathMLElement>[];

  ref: RefObject<HTMLElement | SVGElement | MathMLElement>;

  activeElementStateSet: UseActiveElementReturnValue;
};

export type Option = {
  onKey: Iterable<KeyboardHandler>;

  keyEntries: (context: Context) => KeyEntries;
};

export type ReturnValue = [Attributes, Context];

export default function useToolbarItem(
  { refs, activeElementStateSet, ref }: Readonly<Param>,
  { onKey = ["onKeyDown"], keyEntries = defaultKeyEntries }: Readonly<
    Partial<Option>
  > = {},
): ReturnValue {
  const [activeElement, setActiveElement] = activeElementStateSet;
  const isFirst = isLength0(refs);
  refs.push(ref);

  const isActive = useMemo<boolean>(
    () => isSameNode(ref.current, activeElement),
    [activeElement],
  );

  const targets = useCallback(
    () => filterTruthy(refs.map((ref) => ref.current)),
    [],
  );
  const returnValue = useFocusCallback(targets);

  const context = useMemo<Context>(() => ({
    ...returnValue,
    isFirst,
    isActive,
  }), [
    returnValue.focusFirst,
    returnValue.focusLast,
    returnValue.focusNext,
    returnValue.focusPrev,
    isFirst,
    isActive,
  ]);

  const entries = keyEntries(context);
  const handler = useKeyboardEventHandler(entries);
  const handlerMap = useEventHandler(onKey, handler);

  const tabIndex = useMemo<number>(
    () => calcTabIndex({ isActive, isFirst, hasActivated: !!activeElement }),
    [
      isActive,
      activeElement,
      isFirst,
    ],
  );

  const attributes = useMemo<Attributes>(
    () => ({ ref, tabIndex, ...handlerMap, onFocus: setActiveElement }),
    [
      tabIndex,
      setActiveElement,
    ],
  );

  return [attributes, context];
}

export const defaultKeyEntries: (
  context: Context,
) => KeyEntries = ({ focusFirst, focusLast, focusNext, focusPrev }) => {
  return [
    ["ArrowLeft", focusPrev],
    ["ArrowRight", focusNext],
    ["Home", focusFirst],
    ["End", focusLast],
  ];
};
