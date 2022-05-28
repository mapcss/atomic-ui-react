// This module is browser compatible.

import { useContext } from "react";
import { IdContext, OpenContext } from "./context.ts";
import { ERROR_MSG } from "./constant.ts";
import useDisclosureControl, {
  Attributes,
  AttributesWithContext,
  Contexts,
  Options,
} from "./use_disclosure_control.ts";

export type Props =
  & {
    children: (
      attributes: Attributes,
      contexts: Contexts,
    ) => JSX.Element;
  }
  & Partial<Options>
  & Omit<AttributesWithContext, "children">;

export default function WithDisclosureControl(
  { mutateType, children, ...allAttributes }: Readonly<Props>,
): JSX.Element | never {
  const id = useContext(IdContext);
  const stateSet = useContext(OpenContext);

  if (!id || !stateSet) throw Error(ERROR_MSG);

  const [isOpen, setIsOpen] = stateSet;
  const [attributes, contexts] = useDisclosureControl(
    {
      isOpen,
      id,
      setIsOpen,
    },
    { mutateType },
    allAttributes,
  );

  return children(attributes, contexts);
}
