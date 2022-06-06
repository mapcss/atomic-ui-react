# hooks

It offers a versatile and minimalist hook. It is used internally in this
project.

## API

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

forwardRef<Element>((props, ref) => {
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

### useUpdateEffect

[Source](./use_update_effect.ts.ts) [Test](./use_update_effect_test.ts)

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
