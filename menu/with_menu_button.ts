import {
  AllHTMLAttributes,
  forwardRef as _forwardRef,
  ReactElement,
  Ref,
  RefAttributes,
} from "react";
import useMenuButton, {
  AllAttributesWithContexts,
  Contexts,
} from "./use_menu_button.ts";

export type Props =
  & {
    children: (
      // deno-lint-ignore no-explicit-any
      attributes: AllHTMLAttributes<Element> & RefAttributes<any>,
      contexts: Contexts,
    ) => ReactElement;

    contexts: Contexts;
  }
  & AllAttributesWithContexts;

function _WithMenuButton(
  {
    children,
    contexts,
    ...allAttributes
  }: Readonly<Props>,
  ref: Ref<Element>,
): JSX.Element {
  const attributes = useMenuButton(contexts, allAttributes);

  return children({ ref, ...attributes }, contexts);
}

const WithMenu = _forwardRef(_WithMenuButton);

export default WithMenu;
