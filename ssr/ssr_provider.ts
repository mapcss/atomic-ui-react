// This module is browser compatible.

import { createElement, ReactNode, useRef } from "react";
import { Store } from "../hooks/use_key_id.ts";
import Context from "./context.ts";

export type Props = {
  children: ReactNode;
};

export default function SSRProvider({ children }: Props): JSX.Element {
  const storeRef = useRef<Store>({});

  return createElement(Context.Provider, { value: storeRef }, children);
}
