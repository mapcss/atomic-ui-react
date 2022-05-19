import {
  AllHTMLAttributes,
  cloneElement,
  createElement,
  ReactElement,
  useMemo,
} from "react";
import { isFunction } from "../deps.ts";
import { ActiveElementContext, RefsContext } from "./context.ts";
import useActiveElement from "../hooks/use_active_element.ts";

export type Props = {
  children: ReactElement | ((attributes: Attributes) => ReactElement);
};

export type Attributes = Pick<AllHTMLAttributes<Element>, "role">;

export default function WithToolbar(
  { children }: Readonly<Props>,
): JSX.Element {
  const attributes = useMemo<Attributes>(() => ({
    role: "toolbar",
  }), []);
  const [activeElement, setActiveElement] = useActiveElement();

  const child = isFunction(children) ? children(attributes) : cloneElement(
    children,
    attributes,
  );

  return createElement(
    RefsContext.Provider,
    { value: [] },
    createElement(
      ActiveElementContext.Provider,
      { value: [activeElement, setActiveElement] },
      child,
    ),
  );
}
