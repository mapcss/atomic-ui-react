import {
  forwardRef as _forwardRef,
  HTMLAttributes,
  ReactElement,
  Ref,
  RefAttributes,
  useMemo,
} from "react";
import useMenu, {
  AllAttributesWithContexts,
  Contexts,
  Options,
  Params,
} from "./use_menu_item.ts";
import { RovingTabIndex } from "../focus/mod.ts";

export type Props =
  & {
    children: (
      // deno-lint-ignore no-explicit-any
      attributes: HTMLAttributes<Element> & RefAttributes<any>,
      contexts: Contexts,
    ) => ReactElement;

    contexts: Params & Partial<Options>;
  }
  & Partial<AllAttributesWithContexts>;

function _WithMenu({
  children,
  contexts: { index, activeIndex, focusStrategy = RovingTabIndex, ...rest },
  ...allAttributes
}: Readonly<Props>, ref: Ref<Element>): JSX.Element {
  const isActive = useMemo<boolean>(() => index === activeIndex, [
    index,
    activeIndex,
  ]);

  const attributes = useMenu(
    { isActive, index, activeIndex, focusStrategy, ...rest },
    allAttributes,
  );

  return children({ ref, ...attributes }, {
    isActive,
    index,
    activeIndex,
    focusStrategy,
    ...rest,
  });
}
const WithMenu = _forwardRef(_WithMenu);
export default WithMenu;
