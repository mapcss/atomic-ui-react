// This module is browser compatible.

import { useEffect, useLayoutEffect } from "react";
import { isBrowser } from "../util.ts";

const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
