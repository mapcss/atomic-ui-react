// This module is browser compatible.

import { createContext } from "react";

export const IdsContext = createContext<
  | { titleId: string | undefined; describeId: string | undefined }
  | undefined
>(undefined);
