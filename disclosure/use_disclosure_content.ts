// This module is browser compatible.

import { AllHTMLAttributes, useMemo } from "react";

export type Params = {
  isOpen: boolean;
  id: string;
};

export type Attributes = Pick<AllHTMLAttributes<Element>, "id" | "hidden">;

export default function useDisclosureContent(
  { isOpen, id }: Readonly<Params>,
): Attributes {
  const attributes = useMemo<Attributes>(() => ({
    id,
    hidden: boolAttr(!isOpen),
  }), [isOpen, id]);

  return attributes;
}

function boolAttr(value?: boolean): true | undefined {
  return value ? true : undefined;
}
