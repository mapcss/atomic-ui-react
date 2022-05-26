// This module is browser compatible.
import { MutableRefObject } from "react";
import { Store } from "../hooks/use_key_id.ts";
import { ATOMIC_UI } from "../_shared/constant.ts";

export const defaultStore: MutableRefObject<Store> = { current: {} };
export const ERROR_MSG =
  `${ATOMIC_UI} When server rendering, you must wrap your application in an <SSRProvider> to ensure consistent ids are generated between the client and server.`;
