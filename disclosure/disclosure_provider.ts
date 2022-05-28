// This module is browser compatible.

import { createElement, ReactNode } from "react";
import { IdContext, OpenContext } from "./context.ts";
import useDisclosureProvider, {
  Exclusive,
  Options,
} from "./use_disclosure_provider.ts";

export type Props =
  & {
    children: ReactNode;
  }
  & Exclusive
  & Partial<Pick<Options, "onChangeOpen">>;

export default function DisclosureProvider(
  { children, isOpen, setIsOpen, onChangeOpen, isDefaultOpen }: Props,
): JSX.Element {
  const [states, dispatches] = useDisclosureProvider({
    onChangeOpen,
    isDefaultOpen,
    isOpen: isOpen as never,
    setIsOpen: setIsOpen as never,
  });

  return createElement(
    IdContext.Provider,
    { value: states.id },
    createElement(OpenContext.Provider, {
      value: [states.isOpen, dispatches.setIsOpen],
    }, children),
  );
}
