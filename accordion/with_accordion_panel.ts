// This module is browser compatible.

import {
  AllHTMLAttributes,
  cloneElement,
  ReactElement,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { isFunction } from "../deps.ts";
import {
  IdContext,
  IndexContext,
  PanelCountContext,
  RefsContext,
} from "./context.ts";
import { joinChars } from "../util.ts";
import useAriaAccordionPanel, {
  ReturnValue as UseAriaAccordionPanelReturnValue,
} from "./use_aria_accordion_panel.ts";
import useCallbackFocus from "./use_callback_focus.ts";
import { Context } from "./types.ts";

export type Attributes =
  & UseAriaAccordionPanelReturnValue
  & Pick<AllHTMLAttributes<Element>, "hidden">;

export type Props = {
  children:
    | ReactElement
    | ((attributes: Attributes, context: Context) => ReactElement);
};
export default function WithAccordionPanel({ children }: Props): JSX.Element {
  const id = useContext(IdContext);
  const { next: index } = useContext(
    PanelCountContext,
  );
  const [selectedIndex, setSelectedIndex] = useContext(IndexContext);
  const refs = useContext(RefsContext);

  const isOpen = useMemo<boolean>(() => index === selectedIndex, [
    index,
    selectedIndex,
  ]);
  const open = useCallback<() => void>(() => setSelectedIndex(index), [
    setSelectedIndex,
    index,
  ]);
  const focusCallbackMap = useCallbackFocus({
    refs,
    index,
  });

  const headerId = joinChars([id, "accordion", "header", index], "-");
  const panelId = joinChars([id, "accordion", "panel", index], "-");

  const aria = useAriaAccordionPanel({ id: panelId, headerId });

  const attributes = useMemo<Attributes>(
    () => ({ ...aria, hidden: !isOpen }),
    [JSON.stringify(aria), isOpen],
  );
  const context = useMemo<Context>(
    () => ({ isOpen, open, ...focusCallbackMap, index }),
    [
      isOpen,
      open,
      index,
      focusCallbackMap,
    ],
  );

  if (isFunction(children)) {
    return children(attributes, context);
  }

  return cloneElement(children, attributes);
}
