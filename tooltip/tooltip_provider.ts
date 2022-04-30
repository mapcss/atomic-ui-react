// This module is browser compatible.

import {
  createElement,
  DetailedHTMLProps,
  HTMLAttributes,
  RefObject,
  useEffect,
  useRef,
} from "react";
import useBoolean from "../hooks/use_boolean.ts";

// deno-lint-ignore no-explicit-any
export type Props<R extends Element = any> = {
  wrapper?: (
    props: DetailedHTMLProps<
      HTMLAttributes<HTMLElement>,
      HTMLElement
    >,
  ) => JSX.Element;
  children: (
    context: {
      isShow: boolean;
      ref: RefObject<R>;
    },
  ) => JSX.Element;
};
export default function TooltipProvider(
  {
    children,
    wrapper = (props) =>
      createElement("div", { style: { position: "relative" }, ...props }),
  }: Props,
): JSX.Element {
  const ref = useRef<Element>(null);
  const [state, { on, off }] = useBoolean();

  useEffect(() => {
    if (!ref.current) return;

    ref.current.addEventListener("mouseenter", on, { passive: true });
    ref.current.addEventListener("mouseleave", off, { passive: true });

    return () => {
      if (!ref.current) return;
      ref.current.removeEventListener("mouseenter", on);
      ref.current.removeEventListener("mouseleave", off);
    };
  }, []);

  return wrapper({ children: children({ isShow: state, ref }) });
}
