import { createElement, ReactNode, useCallback } from "react";
import { IsShowProps } from "./types.ts";
import { Exclusive, mappingKey } from "../util.ts";
import { IsShowContexts } from "./contexts.ts";
import { Tag } from "../types.ts";
import useAlterState from "../_shared/use_alter_state.ts";
import useTooltipContainer from "./use_tooltip_container.ts";
import { Contexts } from "./types.ts";
import { AllAttributesWith } from "../hooks/mod.ts";
import { useCallable, useEventListener } from "../hooks/mod.ts";

export type Props<As extends Tag> =
  & {
    /**
     * `div`
     */
    as?: As;

    children?: ReactNode;
  }
  & Exclusive<IsShowProps, {
    /**
     * @default false
     */
    initialIsShow?: boolean;
  }>
  & Partial<AllAttributesWith<[Contexts]>>;
export default function TooltipContainer<As extends Tag = "div">(
  {
    as = "div" as As,
    children,
    initialIsShow = false,
    setIsShow: setState,
    isShow: state,
    ...allAttributes
  }: Readonly<Props<As>>,
): JSX.Element {
  const [isShow, setIsShow] = useAlterState<boolean>(initialIsShow, [
    state,
    setState,
  ]);

  const target = useCallback<() => Document>(() => document, []);
  const keyboardHandler = useCallback((ev: KeyboardEvent) => {
    const runner = mappingKey([
      ["Escape", (ev) => {
        ev.preventDefault();
        setIsShow(false);
      }],
    ]);
    runner(ev);
  }, [setIsShow]);
  const callback = useCallable(keyboardHandler, isShow);

  useEventListener(
    {
      target,
      event: "keydown",
      callback,
    },
    [target, callback],
  );

  const [attributes] = useTooltipContainer(
    { isShow, setIsShow },
    allAttributes,
  );

  return createElement(
    IsShowContexts.Provider,
    {
      value: {
        isShow,
        setIsShow,
      },
    },
    createElement(as, attributes, children),
  );
}
