// This module is browser compatible.

import useDisclosure, { DispatchMap, StateMap } from "./use_disclosure.ts";
export type Context = StateMap & DispatchMap;

export type Props = {
  /** Render props as children. */
  children: (
    context: Context,
  ) => JSX.Element;

  /** Default state of `isOpen`.
   * @default false
   */
  isDefaultOpen?: boolean;
};

export default function DisclosureProvider(
  { children, isDefaultOpen = false }: Props,
): JSX.Element {
  const [state, dispatcher] = useDisclosure(isDefaultOpen);

  const _children = children({
    ...state,
    ...dispatcher,
  });

  return _children;
}
