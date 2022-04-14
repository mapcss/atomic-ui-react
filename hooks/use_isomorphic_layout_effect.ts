import { useEffect, useLayoutEffect } from "react";
import { isBrowser } from "../deps.ts";

const useIsomorphicLayoutEffect = isBrowser ? useEffect : useLayoutEffect;

export default useIsomorphicLayoutEffect;
