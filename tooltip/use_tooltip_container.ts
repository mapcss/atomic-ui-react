import { AllAttributesWith, useAttributesWith } from "../hooks/mod.ts";
import { Contexts } from "./types.ts";

export default function useTooltipContainer(
  contexts: Readonly<Contexts>,
  allAttributes: Partial<AllAttributesWith<[Contexts]>> = {},
) {
  const attributes = useAttributesWith<[Contexts]>([contexts], {
    ...defaultAttributes,
    ...allAttributes,
  });

  return [attributes];
}

const defaultAttributes: Partial<AllAttributesWith<[Contexts]>> = {
  onMouseEnter: (ev, { setIsShow }) => {
    ev.preventDefault();
    setIsShow(true);
  },
  onTouchStart: (ev, { setIsShow }) => {
    ev.preventDefault();
    setIsShow(true);
  },
  onMouseLeave: (ev, { setIsShow }) => {
    ev.preventDefault();
    setIsShow(false);
  },

  style: {
    position: "relative",
  },
};
