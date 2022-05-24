// This module is browser compatible.

import { HTMLAttributes, useMemo } from "react";

export type Attributes = Pick<HTMLAttributes<Element>, "role">;

export default function useAlert(): Attributes {
  const attributes = useMemo<Attributes>(() => attrs, []);

  return attributes;
}

const attrs: Attributes = {
  role: "alert",
};
