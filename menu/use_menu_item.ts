import {
  AllAttributesWith,
  useAttributesWith,
  UseIdReturns,
} from "../hooks/mod.ts";
import { FocusStrategyProps, useFocusStrategy } from "../focus/mod.ts";
import { ActiveIndexProps } from "../_shared/types.ts";
import { CommonContexts } from "./types.ts";

export type Params = CommonContexts & ActiveIndexProps & UseIdReturns;
export type Options = FocusStrategyProps;
export type Contexts = Params & Options & { isActive: boolean };
export type AllAttributesWithContexts = AllAttributesWith<[Contexts]>;

export default function useMenuItem(
  { id, isActive, focusStrategy, ...rest }: Contexts,
  allAttributes: Partial<AllAttributesWithContexts> = {},
) {
  const focusAttributes = useFocusStrategy({
    strategy: focusStrategy,
    type: "child",
    payload: {
      isActive,
      id,
    },
  });
  const attributes = useAttributesWith([{
    id,
    isActive,
    focusStrategy,
    ...rest,
  }], {
    ...defaultAttributes,
    ...focusAttributes,
    ...allAttributes,
  });

  return attributes;
}

const defaultAttributes: Partial<AllAttributesWithContexts> = {
  role: "menuitem",
};
