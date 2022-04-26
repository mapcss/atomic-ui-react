# transition

Monitor component lifecycles and control transitions.

## Feature

- No style
- Provider Component and composable hooks.
- Provides Vue-like, className-based transitions.

  Because they are infinitely smaller and higher performing, they can replace
  className-based 3rd party modules such as
  [headlessui/transition](https://headlessui.dev/react/transition).

## API

### TransitionProvider

Component to automatically adapt transitions to the root child.

#### Props

```ts
import { ReactElement, RefObject } from "react";
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

  /** Classes the enter phase is ended. */
  entered: string;

  /** Classes during the entire leave phase. */
  leave: string;

  /** Classes before the leave phase starts. */
  leaveTo: string;

  /** Classes to immediately after the leave phase starts. */
  leaveFrom: string;

  leaved: string;
  /** Classes the leave phase is ended. */
};
type Transition = keyof TransitionProps;
type UseTransitionReturnValue = {
  /** The className from adapted currently transition. */
  className: string | undefined;

  /** The className tokens adapted currently transition. */
  classNames: string[];

  /** Whether transition is completed and `isShow` state is `false` or not. */
  isShowable: boolean;

  /** Whether transition lifecycle is completed or not. */
  isCompleted: boolean;

  /** Non-duplicated token and space transition props
   * It guarantee that there is no empty string or spaces only
   * characters.
   */
  cleanTransitionProps: Partial<TransitionProps>;

  /** List of currently adapted transition. */
  currentTransitions: Transition[];

  /** Current transition lifecycle */
  lifecycle: TransitionLifecycle;
};
type TransitionRenderContext<E extends Element = Element> = {
  /** Root child adapting transitions. */
  children: ReactElement;

  /** The root child `RefObject` */
  ref: RefObject<E>;

  /** Whether transition is completed and `isShow` state is `false` or not. */
  isShowable: boolean;
};
type TransitionRenderParam<E extends Element = Element> = {
  /** Root child adapting transitions. */
  children: ReactElement;

  /** The root child `RefObject` */
  ref: RefObject<E>;
};
type TransitionRender<E extends Element = Element> = (
  param: TransitionRenderParam<E>,
  context: UseTransitionReturnValue,
) => ReactElement;
type TransitionProviderProps<E extends Element = Element> = {
  /** Root child adapting transitions. */
  children: ReactElement;

  /** Whether the target should be shown or hidden. */
  isShow: boolean;

  /** Call on change transition states. */
  onChange?: (state: UseTransitionReturnValue) => void;

  /** Controls the rendering element. Called just before rendering it returns the element to actually render.
   */
  render?: TransitionRender<E>;

  /** Whether do transitions immediately(on first mount) or not.
   * - `true` - do transition on first mount.
   * - `false` - do not transition on first mount.
   * @default false
   */
  immediate?: boolean;
} & Partial<TransitionProps>;
```

#### Example

```tsx
import { useRef, useState } from "react";
import { TransitionProvider } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";

export default () => {
  const [isShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <TransitionProvider
      enterFrom="opacity-0"
      enter="transition"
      leaveTo="opacity-0"
      leave="transition"
      leaved="opacity-0"
      duration={ref}
      isShow={isShow}
    >
      {({ className }) => {
        return <div ref={ref} className={className}>transition</div>;
      }}
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
  { duration, isShow }: Readonly<UseTransitionParam<T>>,
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
  const { className } = useTransition({ isShow, duration: ref }, {
    enter: "transition duration-300",
    enterFrom: "opacity-0",
  }, [isShow]);
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
  Useable,
} from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
declare function useTransitionLifecycle(
  param: {
    /** Specifies the transition duration */
    duration: number | (() => number);
  } & Partial<Useable>,
  /** Effect will only activate if the values in the list change.
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
  const [isActivated, lifecycle] = useTransitionLifecycle({
    duration: () => {
      const el = globalThis.document.getElementById("target");
      return el ? getDuration(el) : 0;
    },
  }, []);
};
```

## Looking for Atomic CSS?

How about [mapcss](https://github.com/TomokiMiyauci/mapcss)?
