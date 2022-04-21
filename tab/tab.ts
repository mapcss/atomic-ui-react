// This module is browser compatible.

import {
  createElement,
  ForwardedRef,
  forwardRef as _forwardRef,
  useMemo,
} from "react";
import { TAB, TYPE } from "./constant.ts";
import useTabAria, { Param } from "./use_tab_aria.ts";

type _Props<As extends keyof JSX.IntrinsicElements> = {
  /** The element tag as.
   * @default `button`
   */
  as?: As;

  /** Dynamic rendering props with context. */
  renderProps?: (
    context: Param,
  ) => Omit<JSX.IntrinsicElements[As], keyof _Props<As>>;
} & Partial<Param>;

export type Props<As extends keyof JSX.IntrinsicElements = "button"> =
  & _Props<As>
  & Omit<JSX.IntrinsicElements[As], keyof _Props<As>>;

function _Tab<As extends keyof JSX.IntrinsicElements = "button">(
  {
    as,
    isSelected,
    isDisabled,
    tabPanelId,
    renderProps,
    ...rest
  }: Props<As>,
  ref: ForwardedRef<As>,
): JSX.Element {
  const props = useMemo(
    () =>
      renderProps?.({
        isSelected: isSelected ?? false,
        isDisabled: isDisabled ?? false,
        tabPanelId: tabPanelId ?? "",
      }) ?? {},
    [isSelected],
  );

  const tabIndexProps = useMemo(() => ({ tabIndex: isSelected ? 0 : -1 }), [
    isSelected,
  ]);

  const aria = useTabAria({ isSelected, tabPanelId, isDisabled });

  return createElement(as ?? "button", {
    ref,
    ...aria,
    ...tabIndexProps,
    ...rest,
    ...props,
  });
}
const Tab = _forwardRef(_Tab);
// deno-lint-ignore no-explicit-any
(Tab as any)[TYPE] = TAB;
export default Tab;
