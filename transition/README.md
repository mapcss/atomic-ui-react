# transition

Monitor component lifecycles and control transitions.

## Feature

- No style
- Provider Component and composable hooks.
- Provides Vue-like, className-based transitions.

  Because they are infinitely smaller and higher performing, they can replace
  className-based 3rd party modules such as
  [headlessui/transition](https://headlessui.dev/react/transition).

## Example

```tsx
import { useState } from "react";
import { TransitionProvider } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";

export default () => {
  const [state] = useState(false);
  return (
    <TransitionProvider
      enter="transition duration-300"
      enterFrom="opacity-0"
      leave="transition transform duration-500"
      leaveTo="-translate-x-full"
      isShow={state}
    >
      <div />
    </TransitionProvider>
  );
};
```

## API

### TransitionProvider

Component to automatically adapt transitions to the root child.

#### Props

```ts
import { ReactElement } from "react";
type TransitionProviderProps = {
  /** Root child adapting transitions. */
  children: ReactElement;
  isShow: boolean;
  enter?: string;
  enterFrom?: string;
  enterTo?: string;
  leave?: string;
  leaveTo?: string;
  leaveFrom?: string;
};
```

#### Example

```tsx
import { useState } from "react";
import { TransitionProvider } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";

export default () => {
  const [state] = useState(false);
  return (
    <TransitionProvider
      enter="transition duration-300"
      enterFrom="opacity-0"
      leave="transition transform duration-500"
      leaveTo="-translate-x-full"
      isShow={state}
    >
      <div />
    </TransitionProvider>
  );
};
```

### useTransition

Monitors the mount lifecycle and returns the appropriate transition status.

#### Types

```ts
import { RefObject } from "react";
type UseTransitionParam<T extends Element = Element> = {
  /** Target to monitor end of transitions.
   * Specify `Element` or equivalent.
   * The duration and delay of the transition are taken from the actual DOM and used to calculate the length of the transition.
   */
  target: RefObject<T | undefined>;

  /** Whether the target should be shown or hidden. */
  isShow: boolean;
};

type UseTransitionReturnValue = {
  /** The className from adapted currently transition. */
  className: string;

  /** Whether transition lifecycle is completed or not. */
  isCompleted: boolean;

  /** List of currently adapted transition. */
  currentTransitions: Transition[];
};
type Transition =
  | "enter"
  | "enterFrom"
  | "enterTo"
  | "leave"
  | "leaveTo"
  | "leaveFrom";
type TransitionProps = Record<Transition, string>;

declare function useTransition<T extends Element>(
  { target, isShow }: Readonly<UseTransitionParam<T>>,
  transitionProps: Readonly<Partial<TransitionProps>>,
): UseTransitionReturnValue;
```

#### Example

```tsx
import { useRef, useState } from "react";
import { useTransition } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";

export default () => {
  const [isShow] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const { className } = useTransition({ isShow, target: ref }, {
    enter: "transition duration-300",
    enterFrom: "opacity-0",
  });
  return <div ref={ref} className={className}></div>;
};
```

## Looking for Atomic CSS?

How about
[mapcss]([https://github/mapcss/mapcss](https://github.com/TomokiMiyauci/mapcss))?
