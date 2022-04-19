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

  /** Whether the target should be shown or hidden. */
  isShow: boolean;

  /** Classes during the entire enter phase. */
  enter?: string;

  /** Classes immediately after the enter phase starts. */
  enterFrom?: string;

  /** Classes immediately after the enter phase starts. */
  enterTo?: string;

  /** Classes during the entire leave phase. */
  leave?: string;

  /** Classes before the leave phase starts. */
  leaveTo?: string;

  /** Classes to immediately after the leave phase starts. */
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
import {
  TransitionProps,
  UseTransitionParam,
  UseTransitionReturnValue,
} from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";

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

### useTransitionLifecycle

Reactive state that records the current status of the transaction lifecycle

#### Types

```ts
import { DependencyList } from "react";
import {
  TransitionLifecycle,
} from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
declare function useTransitionLifecycle(
  /** Specifies the transition duration */
  duration: number | (() => number),
  /** If present, effect will only activate if the values in the list change.
   * Must be specified to monitor component lifecycle. Otherwise, loops may occur.
   */
  deps: DependencyList,
): TransitionLifecycle;
```

#### Example

```tsx
import {
  getDuration,
  useTransitionLifecycle,
} from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";

export default () => {
  const lifeCycle = useTransitionLifecycle(() => {
    const el = globalThis.document.getElementById("target");
    return el ? getDuration(el) : 0;
  }, []);
  console.log(lifeCycle); // 'init'
};
```
