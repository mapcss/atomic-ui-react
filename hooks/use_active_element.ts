import { useCallback, useState } from "react";
import { VFn } from "../deps.ts";

export type ReturnValue = [
  Element | null,
  VFn,
];

export default function useActiveElement(): ReturnValue {
  const [state, _setState] = useState<Element | null>(null);

  const setState = useCallback<VFn>(() => {
    _setState(document.activeElement);
  }, []);

  return [state, setState];
}
