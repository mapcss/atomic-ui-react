import { AllHTMLAttributes, ReactElement } from "react";
import useSwitch, {
  AllAttributesWithContexts,
  Contexts,
  Options,
} from "./use_switch.ts";

type _Props =
  & {
    children: (
      attributes: AllHTMLAttributes<Element>,
      contexts: Contexts,
    ) => ReactElement;
  }
  & Options;

export type Props = AllAttributesWithContexts & _Props;

export default function WithSwitch(
  {
    children,
    isChecked,
    setIsChecked,
    initialIsChecked,
    onChangeIsChecked,
    ...allAttributes
  }: Readonly<
    Props
  >,
): JSX.Element {
  const [attributes, contexts] = useSwitch(
    {
      isChecked,
      setIsChecked: setIsChecked as never,
      initialIsChecked: initialIsChecked as never,
      onChangeIsChecked,
    },
    allAttributes,
  );

  return children(attributes, contexts);
}
