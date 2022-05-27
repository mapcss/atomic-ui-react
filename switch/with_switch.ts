import { ReactElement } from "react";
import useSwitch, {
  Attributes,
  Contexts,
  Options,
  Params,
} from "./use_switch.ts";

export type Props =
  & {
    children: (attributes: Attributes, contexts: Contexts) => ReactElement;
  }
  & Params
  & Partial<Omit<Options, "children">>;

export default function WithSwitch(
  { children, isChecked, onValueChange, ...rest }: Readonly<Props>,
): JSX.Element {
  const [attributes, contexts] = useSwitch({ isChecked, onValueChange }, rest);

  return children(attributes, contexts);
}
