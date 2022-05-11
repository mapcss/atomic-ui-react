// This module is browser compatible.

import { HTMLAttributes } from "react";

export type AriaAlert = Pick<HTMLAttributes<Element>, "role">;
const ariaAlert: AriaAlert = {
  role: "alert",
};

export default ariaAlert;
