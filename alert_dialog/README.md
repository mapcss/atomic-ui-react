# alert-dialog

An alert dialog is a modal dialog that interrupts the user's workflow to
communicate an important message and acquire a response.

The alertdialog role enables assistive technologies and browsers to distinguish
alert dialogs from other dialogs so they have the option of giving alert dialogs
special treatment, such as playing a system alert sound.

## Example

```tsx
import {
  AlertDialog,
  DialogDescribe,
  DialogTitle,
  useBoolean,
} from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
import { useCallback, useState } from "react";
export default () => {
  const [isShow, setIsShow] = useState(false);
  const close = useCallback(() => setIsShow(false), []);
  return (
    <AlertDialog
      isShow={isShow}
      setIsShow={setIsShow}
      hasTitle
      hasDescribe
    >
      <DialogTitle>Title</DialogTitle>
      <DialogDescribe>Describe it</DialogDescribe>

      <button onClick={close}>Cancel</button>
      <button onClick={close}>OK</button>
    </AlertDialog>
  );
};
```

result:

```html
<div
  role="alertdialog"
  aria-modal="true"
  aria-labelledby="atomic-ui-0-dialog-title"
  aria-describedby="atomic-ui-0-dialog-describe"
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
