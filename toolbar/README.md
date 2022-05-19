# toolbar

## Example

```tsx
import {
  ToolbarProvider,
  WithToolbar,
  WithToolbarItem,
} from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";

export default () => {
  return (
    <ToolbarProvider>
      <WithToolbar>
        <div>
          <WithToolbarItem>
            <button></button>
          </WithToolbarItem>

          <WithToolbarItem>
            <button></button>
          </WithToolbarItem>
        </div>
      </WithToolbar>
    </ToolbarProvider>
  );
};
```
