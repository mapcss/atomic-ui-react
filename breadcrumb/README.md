# breadcrumb

A breadcrumb consists of a list of links to the parent pages of the current page
in hierarchical order. It helps users find their place within a website or web
application. Breadcrumbs are often placed horizontally before a page's main
content.

## Quick view

```tsx
import { Breadcrumb } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
export default () => {
  return (
    <Breadcrumb>
      <a href="/html">HTML</a>
      <a href="/html/breadcrumb">Breadcrumb</a>
      <a href="/html/breadcrumb/example">Example</a>
    </Breadcrumb>
  );
};
```

render as:

```html
<nav aria-label="Breadcrumb">
  <ol>
    <li>
      <a href="/html">HTML</a>
    </li>
    <li aria-hidden="true">/</li>
    <li>
      <a href="/html/breadcrumb">Breadcrumb</a>
    </li>
    <li aria-hidden="true">/</li>
    <li>
      <a href="/html/breadcrumb/example" aria-current="page">Example</a>
    </li>
  </ol>
</nav>
```

features:

- The set of links is structured using an ordered list.
- A `nav` element labeled Breadcrumb identifies the structure as a breadcrumb
  trail and makes it a navigation landmark so that it is easy to locate.
- separators is automatically added. This is accompanied by the `aria-hidden`
  attribute, which is not announced by the screen readers. It is also fully
  customizable.
- If the last element is an anchor element, the `aria-current` attribute is
  automatically added. You have full control over this.
- `nav`, `ol` and `li` elements are fully customizable.

## API

### Props

| Name                | Required / Default | Describe                                                                                                                                                                                                                    |
| ------------------- | :----------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| children            | :white_check_mark: | `ReactNode` &#124; `Iterable<ReactNode>`<br>Child or children.                                                                                                                                                              |
| separator           |       `"/"`        | `ReactNode`<br> Separator between breadcrumb.                                                                                                                                                                               |
| disabledAriaCurrent |      `false`       | `boolean`<br>Whether to disable the automatic assignment of `aria-current`.<ul><li> `true` - If the last element is an anchor element, the `aria-current` attribute will be added.</li><li> `false` - Do nothing.</li></ul> |
| components          |         -          | `Partial<Components>`<br>The key is the name of the element to override. The value is the component to render instead.                                                                                                      |

#### Components

| Name | Required / Default | Description                                                                              |
| ---- | :----------------: | ---------------------------------------------------------------------------------------- |
| nav  |    `defaultNav`    | `(props: NavProps) => JSX.Element`<br> Override `nav` component.                         |
| ol   |    `defaultOl`     | `(props: OlProps) => JSX.Element`<br> Override `ol` component.                           |
| li   |    `defaultLi`     | `(props: LiProps, { forSeparator: boolean}) => JSX.Element`<br> Override `li` component. |

```ts
import { createElement, PropsWithChildren } from "react";
type Component<Args extends readonly unknown[]> = (
  ...args: Args
) => JSX.Element;

const defaultNav: Component<[PropsWithChildren<unknown>]> = (props) =>
  createElement("nav", { "aria-label": "Breadcrumb", ...props });
const defaultOl: Component<[PropsWithChildren<unknown>]> = (props) =>
  createElement("ol", props);
const defaultLi: Component<
  [PropsWithChildren<unknown>, { forSeparator: boolean }]
> = (
  props,
  { forSeparator },
) => {
  const attributes = forSeparator ? { "aria-hidden": "true", ...props } : props;
  return createElement("li", attributes);
};
```

### Return

`JSX.Element`

### Customize element

The breadcrumb component provides the breadcrumb frame. You have complete
control over the output HTML. For example, instead of `ol`, you can add an `ul`
tag, plus attributes:

```tsx
import { Breadcrumb } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
export default () => {
  return (
    <Breadcrumb
      components={{
        ol: (props) => <ul {...props} className="text-lg"></ul>,
      }}
    >
      <a>1</a>
      <a>2</a>
    </Breadcrumb>
  );
};
```

render as:

```html
<nav aria-label="Breadcrumb">
  <ul class="text-lg">
    <li>
      <a>1</a>
    </li>
    <li aria-hidden="true">/</li>
    <li>
      <a aria-current="page">2</a>
    </li>
  </ul>
</nav>
```

`nav` and `li` can be customized as well.

### Customize separator

Separator can also be fully controlled. By default, it renders `/` text nodes.
It accepts `ReactNode`, so you can render any node you like.

```tsx
import { Breadcrumb } from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
export default () => {
  return (
    <Breadcrumb
      separator={<span>{">"}</span>}
    >
      <a>1</a>
      <a>2</a>
    </Breadcrumb>
  );
};
```

render as:

```html
<nav aria-label="Breadcrumb">
  <ol>
    <li>
      <a>1</a>
    </li>
    <li aria-hidden="true">
      <span>&gt;</span>
    </li>
    <li>
      <a aria-current="page">2</a>
    </li>
  </ol>
</nav>
```
