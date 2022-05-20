import {
  AllHTMLAttributes,
  cloneElement,
  ReactElement,
  RefAttributes,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { filterTruthy, isSameNode, mergeProps } from "../util.ts";
import { isFunction, isLength0 } from "../deps.ts";
import { AllHandlerMap, KeyboardHandler } from "../types.ts";
import useMergedRef from "../hooks/use_merged_ref.ts";
import { ActiveElementContext, RefsContext } from "./context.ts";
import useKeyboardEventHandler, {
  KeyEntries,
} from "../hooks/use_keyboard_event_handler.ts";
import useFocusCallback, {
  ReturnValue as UseFocusCallbackReturnValue,
} from "../hooks/use_focus_callback.ts";
import { useEventHandler } from "../_shared/hooks.ts";
import { calcTabIndex } from "./util.ts";
import { ATOMIC_UI } from "../_shared/constant.ts";

const ERROR_MSG = `${ATOMIC_UI} Must be wrapped by <ToolbarProvider>`;

export type Attributes =
  & Pick<AllHTMLAttributes<Element>, "tabIndex">
  & AllHandlerMap
  // deno-lint-ignore no-explicit-any
  & RefAttributes<any>;

export type Context = UseFocusCallbackReturnValue & {
  isFirst: boolean;

  isActive: boolean;
};

export type Props = {
  children:
    | ReactElement
    | ((attributes: Attributes, context: Context) => ReactElement);

  onKey?: Iterable<KeyboardHandler>;

  keyEntries?: (context: Context) => KeyEntries;
};

export default function WithToolbarItem(
  { children, onKey = ["onKeyDown"], keyEntries = defaultKeyEntries }: Props,
): JSX.Element {
  const refs = useContext(RefsContext);
  const activeElementContext = useContext(ActiveElementContext);

  if (!refs || !activeElementContext) {
    throw Error(ERROR_MSG);
  }

  const [activeElement, setActiveElement] = activeElementContext;
  const [getRef, ref] = useMergedRef<HTMLElement | SVGElement>(children);
  const isFirst = isLength0(refs);
  refs.push(getRef);

  const isActive = useMemo<boolean>(
    () => isSameNode(getRef.current, activeElement),
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

  const child = isFunction(children)
    ? children(attributes, context)
    : cloneElement(children, mergeProps(children.props, attributes));

  return child;
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
