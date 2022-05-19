import {
  AllHTMLAttributes,
  cloneElement,
  ReactElement,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { filterTruthy, isSameNode, mergeProps } from "../util.ts";
import { isLength0 } from "../deps.ts";
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

export type Attributes =
  & Pick<AllHTMLAttributes<Element>, "tabIndex">
  & AllHandlerMap;

export type Context = UseFocusCallbackReturnValue & {
  isFirst: boolean;

  isActive: boolean;
};

export type Props = {
  children: ReactElement;

  onKey?: Iterable<KeyboardHandler>;

  keyEntries?: (context: Context) => KeyEntries;
};

export default function WithToolbarItem(
  { children, onKey = ["onKeyDown"], keyEntries = defaultKeyEntries }: Props,
): JSX.Element {
  const refs = useContext(RefsContext);
  const [activeElement, setActiveElement] = useContext(ActiveElementContext);

  const [getRef, ref] = useMergedRef(children);
  const isFirst = isLength0(refs);
  refs.push(getRef);

  const isActive = useMemo<boolean>(() => {
    return isSameNode(getRef.current, activeElement);
  }, [activeElement]);

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
    () => ({ tabIndex, ...handlerMap, onFocus: setActiveElement }),
    [
      tabIndex,
      setActiveElement,
    ],
  );

  return cloneElement(children, {
    ref,
    ...mergeProps(children.props, attributes),
  });
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