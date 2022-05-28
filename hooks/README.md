# hooks

It offers a versatile and minimalist hook. It is used internally in this
project.

## API

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

#### Arguments

Accepts up to 1 arguments.

| N | Name  | Required / Default | Description            |
| - | ----- | :----------------: | ---------------------- |
| 1 | value | :white_check_mark: | `T`<br> Current value. |

#### Return

`T | undefined`

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
