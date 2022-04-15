// This module is browser compatible.

import { createElement, Fragment, ReactElement } from "react";

export type Props = {
  children: ReactElement | ReactElement[];
  index: number;
};

export default function Filter(
  { children, index }: Props,
): JSX.Element {
  const child = wrap(children).find((_, i) => index === i);
  return child ?? createElement(Fragment);
}

// deno-lint-ignore no-explicit-any
function wrap<T>(val: T): T extends any[] ? T : T[] {
  return Array.isArray(val) ? val as never : [val] as never;
}
