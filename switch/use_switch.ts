// This module is browser compatible.

import {
  AllHTMLAttributes,
  Dispatch,
  KeyboardEvent,
  SetStateAction,
} from "react";
import useAttributesWith, {
  AllAttributesWith,
  AttributesHandler,
} from "../hooks/use_attributes_with.ts";
import { Exclusive, mappingKey } from "../util.ts";
import useUpdateEffect from "../hooks/use_update_effect.ts";
import useExclusiveState from "../_shared/use_exclusive_state.ts";

export type GlobalScope = {
  /** Whether or not the switch is checked. */
  isChecked: boolean;

  /** Dispatch function of `isChecked`. */
  setIsChecked: Dispatch<SetStateAction<boolean>>;
};

export type LocalScope = {
  /** Initial `isChecked` state.
   * @default false
   */
  initialIsChecked?: boolean;
};

export type Options = {
  /** Call on `isChecked` is mutated with contexts. */
  onChangeIsChecked?: (contexts: Contexts) => void;
} & Exclusive<GlobalScope, LocalScope>;

export type Contexts = GlobalScope;

export type AllAttributesWithContexts = Partial<AllAttributesWith<[Contexts]>>;

export type Returns = [AllHTMLAttributes<Element>, Contexts];

export default function useSwitch(
  {
    isChecked: _isChecked,
    setIsChecked: _setIsChecked,
    initialIsChecked = false,
    onChangeIsChecked,
  }: Readonly<Options> = {},
  allAttributesWith: AllAttributesWithContexts = {},
): Returns {
  const [isChecked, setIsChecked] = useExclusiveState<boolean>({
    initialState: initialIsChecked,
    setState: _setIsChecked,
    state: _isChecked,
  });

  const contexts: Contexts = {
    isChecked,
    setIsChecked,
  };

  useUpdateEffect(() => {
    onChangeIsChecked?.(contexts);
  }, [onChangeIsChecked, contexts.isChecked, contexts.setIsChecked]);

  const attributes = useAttributesWith(
    [contexts],
    { ...defaultAttributes, ...allAttributesWith },
  );

  return [attributes, contexts];
}

const defaultOnKeyDown: AttributesHandler<[Contexts], "onKeyDown"> = (
  ev,
  { isChecked, setIsChecked },
) => {
  const toggle = () => {
    ev.preventDefault();
    setIsChecked(!isChecked);
  };
  mappingKey<KeyboardEvent>([
    ["Space", toggle],
    ["Enter", toggle],
  ])(ev);
};

const defaultOnClick: AttributesHandler<[Contexts], "onClick"> = (
  _,
  { isChecked, setIsChecked },
) => setIsChecked(!isChecked);

const defaultAriaChecked: AttributesHandler<[Contexts], "aria-checked"> = (
  { isChecked },
) => isChecked;

const defaultAttributes: Pick<
  AllAttributesWith<[Contexts]>,
  DefaultAttribute
> = {
  onClick: defaultOnClick,
  onKeyDown: defaultOnKeyDown,
  role: "switch",
  tabIndex: 0,
  "aria-checked": defaultAriaChecked,
};

export type DefaultAttribute =
  | "role"
  | "tabIndex"
  | "onClick"
  | "onKeyDown"
  | "aria-checked";
