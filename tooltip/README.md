# Tooltip

A tooltip is a popup that displays information related to an element when the
element receives keyboard focus or the mouse hovers over it.

It typically appears after a small delay and disappears when <kbd>Escape</kbd>
is pressed or on mouse out.

## Example

```tsx
import {
  Tooltip,
  TooltipContainer,
  TooltipTrigger,
} from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
import { useState } from "react";
export default () => {
  return (
    <TooltipContainer>
      <TooltipTrigger>trigger</TooltipTrigger>
      <Tooltip>tooltip</Tooltip>
    </TooltipContainer>
  );
};
```
