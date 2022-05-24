# toolbar

## Example

```tsx
import {
  Toolbar,
  ToolbarItem,
  ToolbarProvider,
} from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";

export default () => {
  return (
    <ToolbarProvider>
      <Toolbar>
        <ToolbarItem>1</ToolbarItem>
        <ToolbarItem>2</ToolbarItem>
        <ToolbarItem>3</ToolbarItem>
      </Toolbar>
    </ToolbarProvider>
  );
};
```
