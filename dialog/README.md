# dialog

A dialog is a window overlaid on either the primary window or another dialog
window.

dialogs contain their tab sequence.

## Example

```tsx
import {
  Dialog,
  DialogDescribe,
  DialogTitle,
} from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
import { useState } from "react";
export default () => {
  const stateSet = useState(false);
  return (
    <Dialog isShowSet={stateSet} hasTitle hasDescribe>
      <DialogTitle>Title</DialogTitle>
      <DialogDescribe>Describe it</DialogDescribe>

      <button onClick={close}>Cancel</button>
      <button onClick={close}>OK</button>
    </Dialog>
  );
};
```

result:

```html
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="atomic-ui-0-dialog-title"
  aria-describedby="atomic-ui-0-dialog-describe"
  hidden
>
  <h3 id="atomic-ui-0-dialog-title">Title</h3>
  <p id="atomic-ui-0-dialog-describe">Describe it</p>

  <button>Cancel</button>
  <button>OK</button>
</div>;
```

and

- Focuses on a first focusable element within a Dialog component.
  (`<button>Cancel</button>`)
- key down the `Tab` key and the `Tab` + `shift` key will focus on only the
  focusable elements in the Dialog component.
- When key down `Escape`, call `onClose` callback.
