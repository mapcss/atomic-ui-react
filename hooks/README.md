# hooks

It offers a versatile and minimalist hook. It is used internally in this
project.

## API

### useBind

[Source](./use_bind.ts) [Test](./use_bind_test.ts)

Bind arguments to the function. The actual binding is done when the function is
called.

#### Example

```tsx
import { useState } from "react";
import { useBind } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";

function add(a: number, b: number): number {
  return a + b;
}
export default () => {
  const [state, setState] = useState(0);
  const inc = useBind(setState, (state) => state + 1);
  // inc()
  const add1 = useBind(add, 1);
  // add1(2) // 3
};
```

#### Generics

- `F extends ( ...args: readonly any[]) => any`
- `Args extends Sequence<Parameters<F>>`

```tsx
type Sequence<T extends readonly any[]> = T extends [infer F, ...infer R]
  ? [F, ...Sequence<R>] | [F]
  : [];
```

#### Params

| N | Name    | Required / Default | Description                        |
| - | ------- | :----------------: | ---------------------------------- |
| 1 | fn      | :white_check_mark: | `F`<br>Function to bind arguments. |
| 2 | ...args |         -          | `Args`<br>bind arguments.          |

#### Return

`( ...rest: Slice<Parameters<F>, Args["length"], Parameters<F>["length"]> ) => ReturnType<F>`

### useCallable

[Source](./use_callable.ts) [Test](./use_callable_test.ts)

Create a conditional callable function.

#### Example

```tsx
import { useCallable } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";

export default () => {
  const callback = useCallable(() => {
    console.log("This will not call");
  }, false);
};
```

#### Generics

- `F extends (...args: readonly any[]) => any`

#### Params

| N | Name     | Required / Default | Description                                                                                                                                                            |
| - | -------- | :----------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 | callback | :white_check_mark: | `F`<br>The callback function.                                                                                                                                          |
| 2 | callable |       `true`       | `boolean`<br>condition. <ul><li> `true` callback is called and returns its return value.</li><li> `false` callback will not be called and will return early.</li></ul> |

#### Return

`(...args: Parameters<F>) => ReturnType<F> | undefined`

### useBoolean

[Source](./use_boolean.ts) [Test](./use_boolean_test.ts)

Manage boolean (on - off) states.

#### Example

```tsx
import { useBoolean } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
export default () => {
  const [state, { on, off, toggle }] = useBoolean();
};
```

#### Arguments

Accepts up to 1 arguments.

| N | Name         | Required / Default | Description                                                                                   |
| - | ------------ | :----------------: | --------------------------------------------------------------------------------------------- |
| 1 | initialState |      `false`       | `boolean` &#124; `(() =>boolean`<br> Initial state or function that return the initial state. |

#### Returns

`[boolean, Callbacks]`

`Callbacks`

| Name   | Description                         |
| ------ | ----------------------------------- |
| on     | `() => void`<br> Update to `true`.  |
| off    | `() => void`<br> Update to `false`. |
| toggle | `() => void`<br> Toggle state.      |

### useDep

[Source](./use_dep.ts) [Test](./use_dep_test.ts)

Hooks for `deps` that define custom equivalence function. Custom equivalent
functions can suppress re-execution of hooks. This is useful when `deps`
contains objects.

> If the object's properties are obvious, it is recommended to enumerate the
> values in `deps`.

#### Example

```tsx
import {
  equal,
  useDep,
} from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
import { useEffect } from "react";
export default () => {
  const object: Record<PropertyKey, unknown> = {};
  const $object = useDep(object, (prev, current) => equal(prev, current));

  useEffect(() => {
    console.log(object);
  }, [$object]);
};
```

#### Generics

- `T`

#### Arguments

Accepts up to 2 arguments.

| N | Name    | Required / Default | Description                                                                                                                                                  |
| - | ------- | :----------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1 | dep     | :white_check_mark: | `T`<br> Value to which the custom comparison function is adapted. This specifies the value that should be the argument of `deps`.                            |
| 2 | compare | :white_check_mark: | `(prev: T, current: T) => boolean`<br> Comparison function. The first argument is the value at the last rendering, the second argument is the current value. |

#### Return

`boolean`

### useEventListener

[Source](./use_event_listener.ts) [Test](./use_event_listener_test.ts)

Hook to register event listeners. Automatically removes event listeners when
unmounting and whenever `deps` is changed.

#### Example

```tsx
import { useEventListener } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
export default () => {
  useEventListener({
    target: () => document,
    event: "keydown",
    callback: (ev) => {
      // console.log(ev.code)
    },
    options: {
      passive: true,
    },
  }, []);
};
```

#### Generics

- `Target extends EventTarget`
- `Ev extends keyof EventMap<Target> = keyof EventMap<Target>`

```ts
type EventMap<T> = T extends Window ? WindowEventMap
  : T extends WindowEventHandlers ? WindowEventHandlersEventMap
  : T extends Document ? DocumentEventMap
  : T extends HTMLElement ? HTMLElementEventMap
  : T extends SVGElement ? SVGElementEventMap
  : T extends SVGSVGElement ? SVGSVGElementEventMap
  : T extends Element ? ElementEventMap
  : T extends Animation ? AnimationEventMap
  : T extends ServiceWorker ? ServiceWorkerEventMap
  : T extends ServiceWorkerContainer ? ServiceWorkerContainerEventMap
  : T extends ServiceWorkerRegistration ? ServiceWorkerRegistrationEventMap
  : T extends Worker ? WorkerEventMap
  : T extends SharedWorker ? AbstractWorkerEventMap
  : T extends ShadowRoot ? ShadowRootEventMap
  : T extends SourceBuffer ? SourceBufferEventMap
  : T extends SourceBufferList ? SourceBufferListEventMap
  : T extends SpeechSynthesis ? SpeechSynthesisEventMap
  : T extends SpeechSynthesisUtterance ? SpeechSynthesisUtteranceEventMap
  : T extends TextTrack ? TextTrackEventMap
  : T extends TextTrackCue ? TextTrackCueEventMap
  : T extends TextTrackList ? TextTrackListEventMap
  : T extends VisualViewport ? VisualViewportEventMap
  : T extends WebSocket ? WebSocketEventMap
  : T extends XMLHttpRequest ? XMLHttpRequestEventMap
  : T extends XMLHttpRequestEventTarget ? XMLHttpRequestEventTargetEventMap
  : T extends AbortSignal ? AbortSignalEventMap
  : never;
```

#### Params

| N | Name     | Required / Default | Description                                                                                                                                         |
| - | -------- | :----------------: | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 | params   | :white_check_mark: | useEventListener parameters                                                                                                                         |
|   | target   | :white_check_mark: | `Target` &#124; `null` &#124; `undefined` &#124; `(() => Target` &#124; `null` &#124; `undefined` `)`<br>The target to add event listener.          |
|   | callback | :white_check_mark: | `(ev: EventMap<Target>[Ev]) => void`<br>The callback event.                                                                                         |
|   | event    | :white_check_mark: | `Ev`<br>Event type.                                                                                                                                 |
|   | options  |         -          | `boolean` &#124; `AddEventListenerOptions`<br>Event listener options. This applies internally to both `addEventListener` and `removeEventListener`. |
| 2 | deps     |         -          | `DependencyList`<br>If present, effect will only activate if the values in the list change.                                                         |

#### Return

`void`

### useId

[Source](./use_id.ts) [Test](./use_id_test.ts)

Hooks for ensure a unique ID for the same prefix.

#### Example

```tsx
import { useId } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
export default () => {
  const { id } = useId(); // atomic-ui-0
};
```

#### Arguments

Accepts up to 1 arguments.

| N | Name    |                                  Required / Default                                  | Description                                        |
| - | ------- | :----------------------------------------------------------------------------------: | -------------------------------------------------- |
| 1 | options | `{ prefix: "atomic-ui", step = 1, initialIndex = 0, formatId = defaultFormatId}`[^4] | `Readonly<Partial<Options>>`[^5]<br> This options. |

[^5]: `Options`

| Name         | Description                                                |
| ------------ | ---------------------------------------------------------- |
| prefix       | `string`<br>Id prefix.                                     |
| formatId     | `(contexts: Contexts) => string`[^6]<br> Format of the Id. |
| step         | `number`<br> Incremental step.                             |
| initialIndex | `number`<br> Initial index.                                |

[^4]: defaultFormatId

@see [defaultFormatId](./use_id.ts#L9)

[^6]: Contexts

`Pick<Options, "prefix" | "step" | "initialIndex"> & Pick<Returns, "index">;`

#### Returns

| Name  | Description                                                                                   |
| ----- | --------------------------------------------------------------------------------------------- |
| id    | `string`<br>Unique Id for the same prefix. This is formatted through the `formatId` function. |
| index | `number`<br>Incremental Id for the same prefix.                                               |

#### Dependency

`useId` depends on [SSRProvider](../ssr/ssr_provider.ts) by default. If useId is
used on the server side, the application must be wrapped in an `SSRProvider`
component.

If you forget to do so, useId will output the following warning:

```ts
// [atomic-ui] When server rendering, you must wrap your application in an <SSRProvider> to ensure consistent ids are generated between the client and server.
```

See [Server side rendering](../ssr/) for details.

### useIsFirstMount

[Source](./use_is_first_mount.ts) [Test](./use_is_first_mount_test.ts)

Whether first mount or not.

#### Example

```tsx
import { useIsFirstMount } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";

export default () => {
  const isFirstMount = useIsFirstMount(); // true
  // re-render
  isFirstMount; // false
};
```

#### Returns

`boolean`

### useIsomorphicLayoutEffect

[Source](./use_isomorphic_layout_effect.ts)
[Test](./use_isomorphic_layout_effect_test.ts)

`useLayoutEffect` that that works on server.

#### Example

```tsx
import { useIsomorphicLayoutEffect } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
export default () => {
  useIsomorphicLayoutEffect(() => {
    // effect
  }, []);
};
```

#### Params

| N | Name   | Required / Default | Description                                                                                 |
| - | ------ | :----------------: | ------------------------------------------------------------------------------------------- |
| 1 | effect | :white_check_mark: | `EffectCallback`<br>Imperative function that can return a cleanup function.                 |
| 2 | deps   |         -          | `DependencyList`<br>If present, effect will only activate if the values in the list change. |

#### Return

`void`

### useLifecycle

Callbacks for component lifecycle. Some callbacks can return a callback function
to be executed before unmount.

#### Example

```tsx
import { useLifecycle } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";

useLifecycle(
  {
    onBeforeMount: () => {
      // call on same as `useLayoutEffect`
    },
    onMounted: () => {
      // call on same as `useEffect`
    },
    onAfterMounted: () => {
      // call on next frame of mount
    },
    onBeforeUnMount: () => {
      // call on before unmount
    },
  },
  [],
);
```

#### Params

| N | Name            | Required / Default | Description                                                            |
| - | --------------- | :----------------: | ---------------------------------------------------------------------- |
| 1 | params          | :white_check_mark: | useLifecycle parameters                                                |
|   | onBeforeMount   |         -          | `EffectCallback`<br>Call on `useLayoutEffect` hooks.                   |
|   | onMounted       |         -          | `EffectCallback`<br>Call on `useEffect` hooks.                         |
|   | onAfterMounted  |         -          | `EffectCallback`<br> Call on next frame of mount.                      |
|   | onBeforeUnMount |         -          | `() => void`<br>Call on before unmount.                                |
| 2 | deps            |         -          | `DependencyList`<br> All callbacks are called whenever `deps` changes. |

#### Return

`void`

### useMergedRef

[Source](./use_merged_ref.ts) [Test](./use_merged_ref_test.ts)

Merges refs and makes them referenceable. Returns a set of getter and setter of
ref. By binding a `setRef` to a component, you can reference a `RefObject` from
a `getRef`.

#### Example

```tsx
import { useMergedRef } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
import { forwardRef, useEffect } from "react";

forwardRef<HTMLDivElement>((props, ref) => {
  const [getRef, setRef] = useMergedRef(ref);
  useEffect(() => {
    // getRef.current
  }, []);
  return <div ref={setRef}>Access to ref</div>;
});
```

#### Generics

- `E = Element`

#### Params

Accepts up to 1 arguments.

| N | Name | Required / Default | Description                            |
| - | ---- | :----------------: | -------------------------------------- |
| 1 | ref  | :white_check_mark: | `Ref<E>`<br>Any ref other than string. |

#### Returns

`[getRef: RefObject<E>, setRef: Ref<E>]`

### useOutside

[Source](./use_outside.ts) [Test](./use_outside_test.ts)

Make callback that call outside of target.

#### Example

```tsx
import { useOutside } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
import { MouseEvent, useRef } from "react";

export default () => {
  const ref = useRef<HTMLDivElement>(null);
  const callback = useOutside<MouseEvent>({
    target: () => ref.current,
    callback: (ev) => {
      console.log("call on outside", ev);
    },
  });

  return (
    <div onClick={callback}>
      outer
      <div ref={ref}>inner</div>
    </div>
  );
};
```

#### Generics

- `Ev extends { currentTarget: EventTarget | null }`

#### Params

| N | Name          |  Required / Default  | Description                                                                                                                                             |
| - | ------------- | :------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 | params        |  :white_check_mark:  | useOutside params                                                                                                                                       |
|   | target        |  :white_check_mark:  | `EventTarget` &#124; `null` &#124; `undefined` &#124; `() => EventTarget` &#124; `null` &#124; `undefined`<br> Criteria target to determine if outside. |
|   | callback      |  :white_check_mark:  | `(ev: Ev) => void`<br>Call on `target` is outside of the current target.                                                                                |
| 2 | options       |          -           | useOutside options                                                                                                                                      |
|   | innerCallback |          -           | `(ev: Ev) => void`<br>Callback called if current target is not outside, contains current target.                                                        |
|   | compare       | `defaultCompare`[^7] | `(current: Node, target: Node) => boolean`<br>Comparison function for outside or not.                                                                   |

[^7]: defaultCompare

```tsx
function defaultCompare(current: Node, node: Node): boolean {
  return node.contains(current);
}
```

#### Returns

`(ev: Ev) => void`

### usePrevious

[Source](./use_previous.ts) [Test](./use_previous_test.ts)

Hooks that return values from previous rendering value.

#### Example

```tsx
import { usePrevious } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
export default () => {
  const prev = usePrevious(false); // undefined
  // rerender
  prev; // false
};
```

#### Generics

- `T`
- `U = undefined`

#### Arguments

Accepts up to 2 arguments.

| N | Name         | Required / Default | Description                       |
| - | ------------ | :----------------: | --------------------------------- |
| 1 | state        | :white_check_mark: | `T`<br> Current state.            |
| 2 | initialValue |    `undefined`     | `U`<br>Initial value as previous. |

#### Return

`T | U | undefined`

### useTimeout

[Source](./use_timeout.ts) [Test](./use_timeout_test.ts)

Safe `setTimeout` that automatically clear on unmount or `deps` is updated.

#### Example

```tsx
import { useTimeout } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
export default () => {
  useTimeout({
    callback: () => {
      console.log("call after 2s");
    },
    ms: 2000,
  }, []);
};
```

#### Params

| N | Name     | Required / Default | Description                                                                                                                                                                                                                                                         |
| - | -------- | :----------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 | params   | :white_check_mark: | useTimeout parameters.                                                                                                                                                                                                                                              |
|   | callback | :white_check_mark: | `EffectCallback` &#124; `TimerHandler`<br>A function to be executed after the timer expires.                                                                                                                                                                        |
|   | ms       | :white_check_mark: | `number` &#124; `undefined`<br>The time, in milliseconds that the timer should wait before the specified function or code is executed. If this parameter is omitted, a value of 0 is used, meaning execute "immediately", or more accurately, the next event cycle. |
|   | args     |        `[]`        | `Iterable<unknown>`<br>Additional arguments which are passed through to the function specified by `function`.                                                                                                                                                       |
| 2 | deps     |         -          | `DependencyList`<br>If present, effect will only activate if the values in the list change.                                                                                                                                                                         |

#### Return

`void`

### useUpdateEffect

[Source](./use_update_effect.ts) [Test](./use_update_effect_test.ts)

Accepts a function that contains imperative, possibly effectful code. It is not
called at first rendering, and the side effect is executed only at re-rendering.

#### Example

```tsx
import { useUpdateEffect } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";

export default () => {
  useUpdateEffect(() => {});
};
```

#### Arguments

Accepts up to 3 arguments.

|  N  | Name    | Required / Default | Description                                                                                                                                                                                                |
| :-: | ------- | :----------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  1  | effect  | :white_check_mark: | `EffectCallback`[^1] <br> Imperative function that can return a cleanup function.                                                                                                                          |
|  2  | deps    |         -          | `DependencyList`[^2] <br> If present, effect will only activate if the values in the list change.<br> <blockquote>If an empty dependency list is passed, the `effect` will never be executed.</blockquote> |
|  3  | options |         -          | `Readonly<Partial<Options>>` <br> This options.                                                                                                                                                            |
|     |         |                    |                                                                                                                                                                                                            |

`Options`

| Name     | Required / Default | Description                                                                                                                                                       |
| -------- | :----------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| effector |  `useEffect`[^3]   | `typeof useEffect`[^3] &#124; `typeof useLayoutEffect`[^4] <br> Function to call `effect`.<br>It must be the same interface as `useEffect` and `useLayoutEffect`. |

[^1]: `EffectCallback`

```ts
import { EffectCallback } from "react";
```

[^2]: `DependencyList`

```ts
import { EffectCallback } from "react";
```

[^3]: `useEffect`

```ts
import { useEffect } from "react";
```

[^4]: `useLayoutEffect`

```ts
import { useLayoutEffect } from "react";
```

#### Return

`void`
