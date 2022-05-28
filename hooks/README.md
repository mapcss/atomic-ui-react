# hooks

It offers a versatile and minimalist hook. It is used internally in this
project.

## API

### useUpdateEffect

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

Accepts up to three arguments.

|  N  | Name    | Required / Default | Description                                                                                                                                                                                                |
| :-: | ------- | :----------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  1  | effect  | :white_check_mark: | `EffectCallback`[^1] <br> Imperative function that can return a cleanup function.                                                                                                                          |
|  2  | deps    |         -          | `DependencyList`[^2] <br> If present, effect will only activate if the values in the list change.<br> <blockquote>If an empty dependency list is passed, the `effect` will never be executed.</blockquote> |
|  3  | options |         -          | `Readonly<Partial<Options>>`                                                                                                                                                                               |

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

#### Returns

`void`
