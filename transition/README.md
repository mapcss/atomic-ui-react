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
import { Transition } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
import { useState } from "react";

export default () => {
  const [isShow, setIsShow] = useState(false);
  return (
    <Transition
      isShow={isShow}
      enter="transition duration-300"
      enterFrom="opacity-0"
      leave="transition"
      leaved="opacity-0"
    >
      root
    </Transition>
  );
};
```

## API

### Transition

The transition component lets you add `enter`/`leave` transitions.

#### Generics

- `As extends keyof JSX.IntrinsicElements`

#### Props

| Name             | Required / Default | Description                                                                                                                                                          |
| ---------------- | :----------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| isShow           | :white_check_mark: | `boolean`<br>Whether the component should be shown or hidden.                                                                                                        |
| as               |       `div`        | `As`<br>The default tag.                                                                                                                                             |
| immediate        |      `false`       | `boolean`<br>Whether do transitions immediately(on first mount) or not.<br>- `true` - do transition on first mount.<br>- `false` - do not transition on first mount. |
| unmount          |       `true`       | `boolean`<br>Whether unmount(remove DOM) at transition phase is leaved or not.                                                                                       |
| enterFrom        |         -          | `string`<br>Classes before the enter phase starts.                                                                                                                   |
| enter            |         -          | `string`<br>Classes during the entire enter phase.                                                                                                                   |
| enterTo          |         -          | `string`<br>Classes immediately after the enter phase starts.                                                                                                        |
| entered          |         -          | `string`<br>Classes the enter phase is ended.                                                                                                                        |
| leaveFrom        |         -          | `string`<br>Classes during the entire leave phase.                                                                                                                   |
| leave            |         -          | `string`<br>Classes during the entire leave phase.                                                                                                                   |
| leaveTo          |         -          | `string`<br>Classes before the leave phase starts.                                                                                                                   |
| leaved           |         -          | `string`<br>Classes the leave phase is ended.                                                                                                                        |
| ref              |         -          | `Ref<Element>`                                                                                                                                                       |
| ...allAttributes |         -          | `AllHTMLAttributes<Element>`<br>All HTML attributes.                                                                                                                 |

#### Return

`JSX.Element`

### WithTransition

Component to automatically adapt transitions to the root child.

#### Example

```tsx
import { WithTransition } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
export default () => {
  return (
    <WithTransition
      enter="transition duration-300"
      enterFrom="opacity-0"
      leaved="text-red-500"
      isShow
    >
      {(attrs, { isShowable }) => isShowable ? <div {...attrs}></div> : <></>}
    </WithTransition>
  );
};
```

#### Props

| Name      | Required / Default | Description                                                                                                                                                          |
| --------- | :----------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| isShow    | :white_check_mark: | `boolean`<br>Whether the component should be shown or hidden.                                                                                                        |
| children  | :white_check_mark: | `(attributes: Attributes, contexts: Contexts) => ReactElement`<br>Render children with props.                                                                        |
| immediate |      `false`       | `boolean`<br>Whether do transitions immediately(on first mount) or not.<br>- `true` - do transition on first mount.<br>- `false` - do not transition on first mount. |
| enterFrom |         -          | `string`<br>Classes before the enter phase starts.                                                                                                                   |
| enter     |         -          | `string`<br>Classes during the entire enter phase.                                                                                                                   |
| enterTo   |         -          | `string`<br>Classes immediately after the enter phase starts.                                                                                                        |
| entered   |         -          | `string`<br>Classes the enter phase is ended.                                                                                                                        |
| leaveFrom |         -          | `string`<br>Classes during the entire leave phase.                                                                                                                   |
| leave     |         -          | `string`<br>Classes during the entire leave phase.                                                                                                                   |
| leaveTo   |         -          | `string`<br>Classes before the leave phase starts.                                                                                                                   |
| leaved    |         -          | `string`<br>Classes the leave phase is ended.                                                                                                                        |
| ref       |         -          | `Ref<Element>`                                                                                                                                                       |

#### Render props

| N | Name               | Description                                                                                                                                                        |
| - | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1 | attributes         |                                                                                                                                                                    |
|   | className          | `string` &#124; `undefined`                                                                                                                                        |
|   | ref                | `Ref<Element>`                                                                                                                                                     |
| 2 | contexts           |                                                                                                                                                                    |
|   | classNames         | `string[]`<br> The className tokens adapted currently transition.                                                                                                  |
|   | cleanTransitions   | `Partial<Transitions>`<br> Non-duplicated token and space transition props.<br>It guarantee that there is no empty string or spaces only characters.               |
|   | isCompleted        | `boolean`<br>Whether transition lifecycle is completed or not.                                                                                                     |
|   | currentTransitions | `TransitionName[]`<br>List of currently adapted transition.                                                                                                        |
|   | status             | `TransitionStatus`<br>Current transition lifecycle.                                                                                                                |
|   | isShowable         | `boolean`<br>Whether transition is completed and `isShow` state is `false` or not.                                                                                 |
|   | isActivated        | `boolean`<br>Whether transitions are activated or not.                                                                                                             |
|   | lifecycle          | `TransitionLifecycle`<br>Named transition lifecycle.<ul><li> `init`: initializing</li><li> `start`: Start</li><li> `wait`: Waiting</li><li> `end`: Ended</li></ul> |
|   | mode               | `"enter"` &#124; `"leave"` &#124; `undefined`<br>Current transition mode.<br>If it is not activated, return `undefined`.                                           |

### useTransition

Monitors the mount lifecycle and returns the appropriate transition status.

#### Example

```tsx
import { useRef, useState } from "react";
import { useTransition } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";

export default () => {
  const [isEnter] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const [{ className }] = useTransition({ isEnter, duration: ref }, {
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
