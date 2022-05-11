// This module is browser compatible.

import { cloneElement, ReactElement, useContext } from "react";
import useTabListAria from "./use_tab_list_aria.ts";
import { HorizontalContext } from "./context.ts";

export type Props = {
  children: ReactElement;
};

export default function WithTabList(
  { children }: Props,
): JSX.Element {
  const isHorizontal = useContext(HorizontalContext);
  const aria = useTabListAria({ isHorizontal });

  return cloneElement(children, aria);
}
