import { RefObject, useMemo, useRef } from "react";
import useUpdateEffect from "../hooks/use_update_effect.ts";
import { CommonContexts, Dispatches, States } from "./types.ts";
import { Exclusive } from "../util.ts";
import useExclusiveState from "../_shared/use_exclusive_state.ts";

export type Params = Exclusive<OuterProps, InnerProps>;

type OuterProps = {
  activeIndex: number;

  setActiveIndex: (index: number) => void;
};

type InnerProps = {
  initialActiveIndex?: number;
};

export type Options = {
  onChangeActive: (contexts: CommonContexts) => void;
};

type Returns = [States, Dispatches];

export default function useToolbarState(
  {
    activeIndex: state,
    setActiveIndex: setState,
    initialActiveIndex: initialState = 0,
  }: Readonly<
    Params
  >,
  { onChangeActive }: Readonly<Partial<Options>> = {},
) {
  const [activeIndex, setActiveIndex] = useExclusiveState({
    state,
    setState,
    initialState,
  });
  const itemsRef = useRef<
    RefObject<HTMLElement | SVGElement | MathMLElement>[]
  >(
    [],
  );

  useUpdateEffect(() => {
    itemsRef.current[activeIndex]?.current?.focus();
  }, [activeIndex]);

  useUpdateEffect(() => {
    onChangeActive?.({ activeIndex, setActiveIndex, itemsRef });
  }, [onChangeActive, activeIndex, setActiveIndex]);

  const returns = useMemo<Returns>(
    () => [{ activeIndex, itemsRef }, { setActiveIndex }],
    [activeIndex, setActiveIndex],
  );

  return returns;
}
