import { AllHTMLAttributes, ReactElement } from "react";
import useSwitch, {
  AllAttributesWithContexts,
  Contexts,
  Options,
} from "./use_switch.ts";
import { IsCheckedProps } from "./types.ts";

type _Props =
  & {
    children: (
      attributes: AllHTMLAttributes<Element>,
      contexts: Contexts,
    ) => ReactElement;
  }
  & IsCheckedProps
  & Partial<Options>;

export type Props = AllAttributesWithContexts & _Props;

export default function WithSwitch(
  {
    children,
    isChecked,
    setIsChecked,
    onChangeChecked,
    ...allAttributes
  }: Readonly<Props>,
): JSX.Element {
  const [attributes, contexts] = useSwitch(
    {
      isChecked,
      setIsChecked,
    },
    { onChangeChecked },
    allAttributes,
  );

  return children(attributes, contexts);
}
