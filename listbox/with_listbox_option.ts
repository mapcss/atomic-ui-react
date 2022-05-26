import {
  ReactElement,
  RefAttributes,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import useListboxOption, { Attributes } from "./use_listbox_option.ts";
import {
  ActivatedIndexContext,
  IdContext,
  RefsRefContext,
  SelectedIndexContext,
} from "./context.ts";
import useId from "../hooks/use_id.ts";
import useIsFirstMount from "../hooks/use_is_first_mount.ts";
import { getIdPrefix } from "./util.ts";

export type Contexts = {
  isSelect: boolean;
  isActive: boolean;
  id: string;
};

export type Props = {
  children: (
    // deno-lint-ignore no-explicit-any
    attributes: Attributes & RefAttributes<any>,
    contexts: Contexts,
  ) => ReactElement;
};
export default function WithListboxOption(
  { children }: Readonly<Props>,
): JSX.Element {
  const refsRef = useContext(RefsRefContext);
  const selectedIndexStateSet = useContext(SelectedIndexContext);
  const activatedIndexStateSet = useContext(ActivatedIndexContext);
  const _id = useContext(IdContext);

  if (!refsRef || !selectedIndexStateSet || !activatedIndexStateSet || !_id) {
    throw Error();
  }
  const ref = useRef<HTMLElement | SVGElement | MathMLElement>(null);
  const { isFirstMount } = useIsFirstMount();
  if (isFirstMount) {
    refsRef.current.push(ref);
  }
  const [activatedIndex] = activatedIndexStateSet;
  const [selectedIndex, setSelectedIndex] = selectedIndexStateSet;

  const prefix = useMemo<string>(
    () => getIdPrefix(_id),
    [_id],
  );

  const { id, index } = useId({ prefix });

  const onSelect = useCallback(() => setSelectedIndex(index), [
    setSelectedIndex,
    index,
  ]);

  const isSelect = useMemo<boolean>(() => index === selectedIndex, [
    index,
    selectedIndex,
  ]);
  const isActive = useMemo<boolean>(() => index === activatedIndex, [
    index,
    activatedIndex,
  ]);

  const contexts: Contexts = {
    isSelect,
    isActive,
    id,
  };

  const [attributes] = useListboxOption(
    { isSelect, id },
    {
      onSelect,
    },
  );

  return children({ ref, ...attributes }, contexts);
}
