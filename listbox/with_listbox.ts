import {
  ReactElement,
  RefAttributes,
  useContext,
  useMemo,
  useRef,
} from "react";
import { isNumber } from "../deps.ts";
import useListbox, { Attributes } from "./use_listbox.ts";
import {
  ActivatedIndexContext,
  IdContext,
  MemorizedContext,
  RefsRefContext,
} from "./context.ts";
import { joinChars } from "../util.ts";
import useIsFirstMount from "../hooks/use_is_first_mount.ts";
import { getIdPrefix } from "./util.ts";

export type Props = {
  // deno-lint-ignore no-explicit-any
  children: (attributes: Attributes & RefAttributes<any>) => ReactElement;
};

export default function WithListbox({ children }: Props): JSX.Element {
  const refsRef = useContext(RefsRefContext);
  const activatedIndexStateSet = useContext(ActivatedIndexContext);
  const memorized = useContext(MemorizedContext);
  const id = useContext(IdContext);
  if (!refsRef || !activatedIndexStateSet || !memorized || !id) throw Error();

  const ref = useRef<HTMLElement | SVGElement>(null);
  const [activatedIndex, setActivatedIndex] = activatedIndexStateSet;

  const isFirstMount = useIsFirstMount();

  const activatedElement = useMemo<
    SVGElement | MathMLElement | null | undefined
  >(() => {
    if (isNumber(activatedIndex)) {
      const els = memorized.targets();
      return Array.from(els)[activatedIndex];
    }
  }, [activatedIndex, memorized.targets]);

  const activeDescendantId = useMemo<string | undefined>(
    () => {
      if (activatedElement) {
        return activatedElement?.id;
      }
      if (isFirstMount && isNumber(activatedIndex)) {
        return joinChars([getIdPrefix(id), activatedIndex], "-");
      }
    },
    [id, isFirstMount, activatedIndex, activatedElement],
  );

  const [attributes] = useListbox({
    targets: memorized.targets,
    activeDescendantId,
  }, {
    onActive: ({ index }) => setActivatedIndex(index),
    activatedIndex,
  });

  return children({ ref, ...attributes });
}
