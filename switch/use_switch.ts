// This module is browser compatible.

import { AllHTMLAttributes } from "react";
import useAttributesWithContext, {
  AllAttributesWithContext,
  AttributesHandler,
} from "../hooks/use_attributes_with_context.ts";
import { mappingKey } from "../util.ts";

export type Params = {
  /** Whether or not the switch is checked. */
  isChecked: boolean;

  /** The function to call when the switch is toggled. */
  onValueChange: (isChecked: boolean) => void;
};

export type Contexts = Params;

export type Options = AllAttributesWithContext<Contexts, Element>;

export type Attributes = Pick<
  AllHTMLAttributes<Element>,
  "role" | "aria-checked" | "tabIndex"
>;

export type Returns = [Attributes, Contexts];

export default function useSwitch(
  { isChecked, onValueChange }: Readonly<Params>,
  { ...allAttributesWithContext }: Readonly<
    Partial<Options>
  > = {},
): Returns {
  const contexts: Contexts = {
    isChecked,
    onValueChange,
  };

  const attributes = useAttributesWithContext({
    attributes: { ...defaultAttributes, ...allAttributesWithContext },
    context: contexts,
  });

  return [attributes, contexts];
}

const defaultOnKeyDown: AttributesHandler<Contexts, "onKeyDown"> = (
  ev,
  { isChecked, onValueChange },
) => {
  const toggle = () => {
    ev.preventDefault();
    onValueChange(!isChecked);
  };
  mappingKey([
    ["Space", toggle],
    ["Enter", toggle],
  ])(ev as unknown as KeyboardEvent);
};

const defaultOnClick: AttributesHandler<Contexts, "onClick"> = (
  _,
  { isChecked, onValueChange },
) => onValueChange(!isChecked);

const defaultAriaChecked: AttributesHandler<Contexts, "aria-checked"> = (
  { isChecked },
) => isChecked;

const defaultAttributes = {
  onClick: defaultOnClick,
  onKeyDown: defaultOnKeyDown,
  role: "switch",
  tabIndex: 0,
  "aria-checked": defaultAriaChecked,
};
