// This module is browser compatible.

import { cloneElement, forwardRef, ReactElement, Ref, useContext } from "react";
import useTabListAria from "./use_tab_list_aria.ts";
import { HorizontalContext } from "./context.ts";

export type Props = {
  children: ReactElement;
};

function _TabList<T>(
  { children }: Props,
  ref: Ref<T>,
): JSX.Element {
  const isHorizontal = useContext(HorizontalContext);
  const aria = useTabListAria({ isHorizontal });

  return cloneElement(children, { ref, ...aria });
}

const TabList = forwardRef(_TabList);

export default TabList;
