import {
  forwardRef as _forwardRef,
  HTMLAttributes,
  ReactElement,
  Ref,
  RefAttributes,
} from "react";
import useMenu, { Contexts, Options, Params } from "./use_menu.ts";
import { RovingTabIndex } from "../focus/mod.ts";

export type Props = {
  children: (
    // deno-lint-ignore no-explicit-any
    attributes: HTMLAttributes<Element> & RefAttributes<any>,
    contexts: Contexts,
  ) => ReactElement;

  contexts: Params & Partial<Options>;
};

function _WithMenu(
  {
    children,
    contexts: { focusStrategy = RovingTabIndex, ...rest },
  }: Readonly<
    Props
  >,
  ref: Ref<Element>,
): JSX.Element {
  const attributes = useMenu({ focusStrategy, ...rest }, {});

  return children({ ref, ...attributes }, { focusStrategy, ...rest });
}

const WithMenu = _forwardRef(_WithMenu);

export default WithMenu;
