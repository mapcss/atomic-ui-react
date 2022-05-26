import {
  createElement,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { isUndefined } from "../deps.ts";
import { current, filterTruthy } from "../util.ts";
import {
  ActivatedIndexContext,
  IdContext,
  MemorizedContext,
  RefsRefContext,
  SelectedIndexContext,
} from "./context.ts";
import useId from "../hooks/use_id.ts";
import { Targets } from "../hooks/use_focus_callback.ts";
import { Memorized } from "./types.ts";

export type Props = {
  children: ReactNode;

  selectedIndex: number | undefined;

  activatedIndex?: number | undefined;

  onChange?: (currentIndex: number) => void;

  onActive?: (currentIndex: number) => void;
};

export default function ListboxProvider(
  {
    children,
    selectedIndex,
    activatedIndex = selectedIndex,
    onChange,
    onActive,
  }: Readonly<
    Props
  >,
): JSX.Element {
  const refsRef = useRef<
    RefObject<HTMLElement | SVGElement | MathMLElement>[]
  >([]);
  const [_selectedIndex, setSelectedIndex] = useState<number | undefined>(
    selectedIndex,
  );
  const [_activatedIndex, setActivatedIndex] = useState<number | undefined>(
    activatedIndex,
  );
  const { id } = useId();
  const targets = useCallback<Targets>(
    () => filterTruthy(refsRef.current.map(current)),
    [],
  );

  const memorized: Memorized = {
    targets,
  };

  useEffect(
    () => {
      if (isUndefined(_activatedIndex)) return;
      onActive?.(_activatedIndex);
    },
    [_activatedIndex, onActive],
  );

  useEffect(
    () => {
      if (isUndefined(_selectedIndex)) return;
      onChange?.(_selectedIndex);
    },
    [_selectedIndex, onChange],
  );

  return createElement(
    IdContext.Provider,
    { value: id },
    createElement(
      RefsRefContext.Provider,
      { value: refsRef },
      createElement(
        SelectedIndexContext.Provider,
        { value: [_selectedIndex, setSelectedIndex] },
        createElement(
          ActivatedIndexContext.Provider,
          { value: [_activatedIndex, setActivatedIndex] },
          createElement(
            MemorizedContext.Provider,
            { value: memorized },
            children,
          ),
        ),
      ),
    ),
  );
}
