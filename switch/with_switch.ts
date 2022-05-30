import { AllHTMLAttributes, ReactElement } from "react";
import useSwitch, {
  AllAttributesWithContexts,
  Contexts,
  Options,
  Params,
} from "./use_switch.ts";

type _Props =
  & {
    children: (
      attributes: AllHTMLAttributes<Element>,
      contexts: Contexts,
    ) => ReactElement;
  }
  & Params
  & Options;

export type Props = AllAttributesWithContexts & _Props;

export default function WithSwitch(
  {
    children,
    isChecked,
    setIsChecked,
    isInitialChecked,
    onChangeChecked,
    ...allAttributes
  }: Readonly<
    Props
  >,
): JSX.Element {
  const [attributes, contexts] = useSwitch(
    {
      isChecked,
      setIsChecked: setIsChecked as never,
      isInitialChecked: isInitialChecked as never,
    },
    { onChangeChecked },
    allAttributes,
  );

  return children(attributes, contexts);
}
