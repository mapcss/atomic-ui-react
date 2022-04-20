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
/** Named transition lifecycle
 * - `init`: Initializing
 * - `start`: Starting
 * - `wait`: Waiting for end
 * - `end`: Ended
 */
type TransitionLifecycle = "init" | "start" | "wait" | "end";
type TransitionProps = {
  /** Classes during the entire enter phase. */
  enter: string;

  /** Classes immediately after the enter phase starts. */
  enterFrom: string;

  /** Classes immediately after the enter phase starts. */
  enterTo: string;

  /** Classes during the entire leave phase. */
  leave: string;

  /** Classes before the leave phase starts. */
  leaveTo: string;

  /** Classes to immediately after the leave phase starts. */
  leaveFrom: string;
};
type Transition = keyof TransitionProps;
type UseTransitionReturnValue = {
  /** The className from adapted currently transition. */
  className: string;

  /** Whether transition lifecycle is completed or not. */
  isCompleted: boolean;

  /** List of currently adapted transition. */
  currentTransitions: Transition[];

  /** Current transition lifecycle */
  lifecycle: TransitionLifecycle;
};
type TransitionRenderContext<P = any> = {
  /** Root child adapting transitions. */
  children: ReactElement;

  /** Props that deep merged with children root props and transition props */
  mergedProps: Partial<P>;

  /** Whether transition is completed and `isShow` state is `false` or not. */
  isShowable: boolean;
};
type TransitionRender<P> = (
  context: TransitionRenderContext<P>,
) => ReactElement;
type TransitionProviderProps<P> = {
  /** Root child adapting transitions. */
  children: ReactElement;

  /** Call on change transition states. */
  onChange?: (state: UseTransitionReturnValue) => void;

  /** Controls the rendering element. Called just before rendering it returns the element to actually render.
   */
  render?: TransitionRender<P>;

  /** Whether the target should be shown or hidden. */
  isShow: boolean;
} & Partial<TransitionProps>;
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

## Looking for Atomic CSS?

How about [mapcss](https://github.com/TomokiMiyauci/mapcss)?
