import { AllHTMLAttributes, ReactElement } from "react";
import useSwitch, {
  AllAttributesWithContexts,
  Contexts,
  Params,
} from "./use_switch.ts";
import { Merge } from "../util.ts";

type _Props = {
  children: (
    attributes: AllHTMLAttributes<Element>,
    contexts: Contexts,
  ) => ReactElement;
} & Params;

export type Props = Merge<AllAttributesWithContexts, _Props>;

export default function WithSwitch(
  { children, isChecked, onValueChange, ...rest }: Readonly<Props>,
): JSX.Element {
  const [attributes, contexts] = useSwitch(
    { isChecked, onValueChange },
    rest,
  );

  return children(attributes, contexts);
}
