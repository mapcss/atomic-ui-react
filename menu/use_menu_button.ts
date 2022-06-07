import { AllHTMLAttributes, KeyboardEvent } from "react";
import { AllAttributesWith, useAttributesWith } from "../hooks/mod.ts";
import { mappingKey } from "../util.ts";
import { CommonContexts } from "./types.ts";

export type Contexts =
  & { menuId: string | undefined; id: string | undefined }
  & CommonContexts;

export type AllAttributesWithContexts = Partial<AllAttributesWith<[Contexts]>>;

export default function useMenuButton(
  contexts: Readonly<Contexts>,
  allAttributes: AllAttributesWithContexts = {},
): AllHTMLAttributes<Element> {
  const attributes = useAttributesWith([contexts], {
    ...defaultAttributes,
    ...allAttributes,
  });

  return attributes;
}

const defaultAttributes: AllAttributesWithContexts = {
  onKeyDown: (ev, { setIsOpen }) => {
    const open = (): void => {
      ev.preventDefault();
      setIsOpen(true);
    };
    const runner = mappingKey<KeyboardEvent>([
      ["Space", open],
      ["Enter", open],
      ["ArrowDown", open],
      ["ArrowUp", open],
    ]);

    runner(ev);
  },
  onClick: (_, { setIsOpen, isOpen }) => setIsOpen(!isOpen),
  "aria-haspopup": "true",
  "aria-expanded": ({ isOpen }) => isOpen,
  tabIndex: 0,
  id: ({ id }) => id!,
  "aria-controls": ({ menuId }) => menuId!,
};
