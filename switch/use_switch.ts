// This module is browser compatible.

import { AllHTMLAttributes, KeyboardEvent } from "react";
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
  setIsChecked: (isChecked: boolean) => void;
};

export type LocalScope = {
  /** Initial `isChecked` state.
   * @default false
   */
  isInitialChecked?: boolean;
};

export type Params = Exclusive<GlobalScope, LocalScope>;

export type Options = {
  /** Call on `isChecked` is mutated with contexts. */
  onChangeChecked?: (contexts: Contexts) => void;
};

export type Contexts = GlobalScope;

export type AllAttributesWithContexts = Partial<AllAttributesWith<[Contexts]>>;

export type Returns = [AllHTMLAttributes<Element>, Contexts];

export default function useSwitch(
  {
    isChecked: state,
    setIsChecked: setState,
    isInitialChecked: initialState = false,
  }: Readonly<Params>,
  {
    onChangeChecked,
  }: Readonly<Options> = {},
  allAttributesWith: AllAttributesWithContexts = {},
): Returns {
  const [isChecked, setIsChecked] = useExclusiveState<boolean>({
    initialState,
    setState,
    state,
  });

  const contexts: Contexts = {
    isChecked,
    setIsChecked,
  };

  useUpdateEffect(() => {
    onChangeChecked?.(contexts);
  }, [onChangeChecked, contexts.isChecked, contexts.setIsChecked]);

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
