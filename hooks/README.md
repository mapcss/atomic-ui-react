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
