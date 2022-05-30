// This module is browser compatible.

import { createElement, ReactNode } from "react";
import { IdContext, OpenContext } from "./context.ts";
import useDisclosureStates, {
  Options,
  Params,
} from "./use_disclosure_states.ts";

export type Props =
  & {
    children: ReactNode;
  }
  & Params
  & Partial<Options>;

export default function DisclosureProvider(
  { children, isOpen, setIsOpen, onChangeOpen, isInitialOpen }: Props,
): JSX.Element {
  const [states, dispatches] = useDisclosureStates({
    isInitialOpen,
    isOpen: isOpen as never,
    setIsOpen: setIsOpen as never,
  }, { onChangeOpen });

  return createElement(
    IdContext.Provider,
    { value: states.id },
    createElement(OpenContext.Provider, {
      value: [states.isOpen, dispatches.setIsOpen],
    }, children),
  );
}
