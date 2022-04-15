// This module is browser compatible.

export { default as Switch } from "./components/switch.tsx";
export type { Props as SwitchProps } from "./components/switch.tsx";
export { default as Transition } from "./components/transition.tsx";
export type { Props as TransitionProps } from "./components/transition.tsx";

export { default as useBoolean } from "./hooks/use_boolean.ts";
export type {
  Param as UseBooleanParam,
  ReturnValue as UseBooleanReturnValue,
} from "./hooks/use_boolean.ts";
export { default as useIsomorphicLayoutEffect } from "./hooks/use_isomorphic_layout_effect.ts";
export { default as useTransition } from "./hooks/use_transition.ts";
export type {
  Param as UseTransitionParam,
  ReturnValue as UseTransitionReturnValue,
} from "./hooks/use_transition.ts";
