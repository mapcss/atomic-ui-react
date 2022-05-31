// This module is browser compatible.

import { ReactElement, useContext } from "react";
import useToolbar, {
  AllAttributesWithContexts,
  Returns,
} from "./use_toolbar.ts";
import { ActiveIndexStateSetContext, ItemsRefContext } from "./context.ts";
import { ERROR_MSG } from "./constants.ts";

export type Props =
  & {
    children: (
      attributes: Returns[0],
      contexts: Returns[1],
    ) => ReactElement;
  }
  & Partial<AllAttributesWithContexts>;

export default function WithToolbar(
  {
    children,
    ...allAttributes
  }: Readonly<
    Props
  >,
): JSX.Element {
  const activeIndexStateSet = useContext(ActiveIndexStateSetContext);
  const itemsRef = useContext(ItemsRefContext);

  if (!activeIndexStateSet || !itemsRef) throw Error(ERROR_MSG);

  const [activeIndex, setActiveIndex] = activeIndexStateSet;

  const [attributes, contexts] = useToolbar({
    setActiveIndex,
    activeIndex,
    itemsRef,
  }, allAttributes);

  return children(attributes, contexts);
}
