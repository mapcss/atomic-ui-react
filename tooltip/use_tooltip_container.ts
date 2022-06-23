import { useCallback } from "react";
import { AllAttributesWith, useAttributesWith } from "../hooks/mod.ts";
import { Contexts } from "./types.ts";
import { mappingKey } from "../util.ts";
import { useCallable, useEventListener } from "../hooks/mod.ts";

export default function useTooltipContainer(
  ctx: Readonly<Contexts>,
  allAttributes: Partial<AllAttributesWith<[Contexts]>> = {},
) {
  const attributes = useAttributesWith<[Contexts]>([ctx], {
    ...defaultAttributes,
    ...allAttributes,
  });

  const target = useCallback<() => Document>(() => document, []);
  const keyboardHandler = useCallback((ev: KeyboardEvent) => {
    const runner = mappingKey([
      ["Escape", (ev) => {
        ev.preventDefault();
        ctx.setIsShow(false);
      }],
    ]);
    runner(ev);
  }, [ctx.setIsShow]);
  const callback = useCallable(keyboardHandler, ctx.isShow);

  useEventListener(
    {
      target,
      event: "keydown",
      callback,
    },
    [target, callback],
  );

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
