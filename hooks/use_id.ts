// This module is browser compatible.

import { useEffect, useRef, useState } from "react";
import useSSRSafeId from "../ssr/use_ssr_safe_id.ts";
import useIsomorphicLayoutEffect from "./use_isomorphic_layout_effect.ts";

const idsUpdaterMap: Map<string, (v: string) => void> = new Map();

export default function useId(defaultId?: string): string {
  const isRendering = useRef(true);
  isRendering.current = true;
  const [value, setValue] = useState(defaultId);
  const nextId = useRef<string | undefined>(undefined);

  const res = useSSRSafeId(value);

  // don't memo this, we want it new each render so that the Effects always run
  const updateValue = (val: string) => {
    if (!isRendering.current) {
      setValue(val);
    } else {
      nextId.current = val;
    }
  };

  idsUpdaterMap.set(res, updateValue);

  useIsomorphicLayoutEffect(() => {
    isRendering.current = false;
  }, [updateValue]);

  useIsomorphicLayoutEffect(() => {
    const r = res;
    return () => {
      idsUpdaterMap.delete(r);
    };
  }, [res]);

  useEffect(() => {
    const newId = nextId.current;
    if (newId) {
      setValue(newId);
      nextId.current = undefined;
    }
  }, [setValue, updateValue]);
  return res;
}
