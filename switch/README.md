# switch

A switch is an input widget that allows users to choose one of two values: on or
off.

## Quick View

```tsx
import { Switch } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
export default () => {
  return <Switch />;
};
```

render as:

```html
<button role="switch" tabindex="0" aria-checked="false"></button>
```

features:

- The switch has role `switch`.
- When switch is clicked, toggle state.
- When switch has focus and key down `Space` or `Enter`, toggle state.
- When `on`, the switch has state `aria-checked` set to `"true"`.
- When `off`, the switch has state `aria-checked` set to `"false"`.

## default attributes

- `role` = "switch"
- `aria-checked`
- `tabIndex` = 0
- `onClick`
- `onKeyDown`
  - <kbd>Space</kbd>
  - <kbd>Enter</kbd>

## API

### Switch

[Source](./switch.ts) [Test](./switch_test.tsx)

type: `Component`

#### Example

```tsx
import { Switch } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
export default () => {
  return <Switch />;
};
```

#### Generics

- `T As extends keyof JSX.IntrinsicElements = "button"`

#### Props

| Name             | Required / Default | Description                                                                     |
| ---------------- | :----------------: | ------------------------------------------------------------------------------- |
| as               |      'button'      | `T`<br>Element type                                                             |
| children         |         -          | `ReactNode`<br>Children.                                                        |
| isCheckedSet     |         -          | `[boolean, Dispatch<boolean>]`<br> `isChecked` and dispatch it set.             |
| initialIsChecked |      `false`       | `boolean`<br>Initial `isChecked` state.                                         |
| onIsCheckChange  |         -          | `(contexts: Contexts) => void`<br>Call on `isChecked` is mutated with contexts. |
| ...allAttributes |         -          | `AllAttributesWith<[Contexts]>`<br>All HTML attributes.                         |

@remark

Only one of `isCheckedSet` and `initialIsChecked` must be specified.

#### Contexts

- `isChecked`
- `setIsChecked`

#### Return

`JSX.Element`

#### Scoped state

See [Scoped state](../concepts/scoped_state.md) for more information.

##### Controllable

`isCheckedSet`

```tsx
import { Switch } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
import { useState } from "react";
export default () => {
  const [state, setState] = useState(true);
  return (
    <>
      <button onClick={() => setState((state) => !state)}>toggle</button>
      <Switch isCheckedSet={[state, setState]} />
    </>
  );
};
```

##### Uncontrollable

`initialIsChecked`

```tsx
import { Switch } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
export default () => {
  return <Switch initialIsChecked />;
};
```
