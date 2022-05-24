// This module is browser compatible.

import { createContext } from "react";

export const ExistenceContext = createContext({
  title: false,
  describe: false,
});

export const IdsContext = createContext<
  | { id: string; titleId: string | undefined; describeId: string | undefined }
  | undefined
>(undefined);
