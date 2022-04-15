// This module is browser compatible.

import { createElement, useEffect, useRef } from "react";
import useAttribute, { Param } from "./use_attribute.ts.ts";

type _Props<As extends keyof JSX.IntrinsicElements> = {
  /** The element the Switch should render as.
   * @default `button`
   */
  as?: As;
} & Param;

export type Props<As extends keyof JSX.IntrinsicElements> =
  & _Props<As>
  & Omit<JSX.IntrinsicElements[As], keyof _Props<As>>;

export default function Switch<
  As extends keyof JSX.IntrinsicElements = "button",
>({ checked, onChange, as, ...rest }: Props<As>): JSX.Element {
  const _as = as ?? "button";
  const ref = useRef<HTMLElement>();

  const fn = () => {};

  useEffect(() => {
    if (!ref.current) return;

    ref.current.addEventListener("keydown", fn);

    return () => {
      ref.current?.removeEventListener("keydown", fn);
    };
  }, []);

  const attribute = useAttribute({ checked, onChange });
  return createElement(
    _as,
    {
      ref,
      ...attribute,
      ...rest,
    },
  );
}
