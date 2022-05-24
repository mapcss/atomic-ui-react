// This module is browser compatible.

import { cloneElement, ReactElement, useContext } from "react";
import useTabList from "./use_tab_list.ts";
import { HorizontalContext } from "./context.ts";

export type Props = {
  children: ReactElement;
};

export default function WithTabList(
  { children }: Props,
): JSX.Element {
  const isHorizontal = useContext(HorizontalContext);
  const attributes = useTabList({ isHorizontal });

  return cloneElement(children, attributes);
}
