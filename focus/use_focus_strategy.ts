import { useMemo } from "react";
import useUpdateEffect from "../hooks/use_update_effect.ts";
import {
  Child,
  ChildPayload,
  FocusStrategy,
  Parent,
  ParentPayload,
} from "./types.ts";

export type Params =
  & {
    strategy: FocusStrategy;
  }
  & ({
    type: "parent";
    payload: ParentPayload;
  } | {
    type: "child";
    payload: ChildPayload;
  });

export default function useFocusStrategy({
  strategy: { child, parent },
  type,
  payload,
}: Params) {
  const [instance, hook] = useMemo(
    () => type === "parent" ? [parent, useParent] : [child, useChild],
    [type, parent.attrs, parent.effect, child.effect, child.attrs],
  );

  const attributes = hook(instance as never, payload as never);

  return attributes;
}

function useParent(
  { attrs, effect }: Parent,
  { activeElement }: ParentPayload,
) {
  const attributes = useMemo(() => attrs?.({ activeElement }) ?? {}, [
    activeElement,
    attrs,
  ]);

  useUpdateEffect(() => {
    effect?.({ activeElement });
  }, [activeElement, effect]);

  return attributes;
}

function useChild(
  { attrs, effect }: Child,
  { isActive, activeElement, id }: ChildPayload,
) {
  const attributes = useMemo(
    () => attrs?.({ isActive, activeElement, id }) ?? {},
    [
      attrs,
      isActive,
      activeElement,
      id,
    ],
  );

  useUpdateEffect(() => {
    effect?.({ isActive, activeElement, id });
  }, [effect, isActive, activeElement, id]);

  return attributes;
}
