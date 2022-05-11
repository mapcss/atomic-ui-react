# tab

- No element
- No style
- WAI-ARIA ready
- Provider and Pure Components
- Automatic unique ID with SSR friendly
- Control of selectable tabs in conjunction with `aria-disabled`

## example

```tsx
import {
  TabProvider,
  WithTab,
  WithTabList,
  WithTabPanel,
} from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";

export default () => (
  <TabProvider>
    <WithTabList>
      <div>
        <WithTab>
          <button>Title 1</button>
        </WithTab>
        <WithTab>
          <button>Title 2</button>
        </WithTab>
      </div>
    </WithTabList>

    <WithTabPanel>
      <div>Content 1</div>
    </WithTabPanel>
    <WithTabPanel>
      <div>Content 2</div>
    </WithTabPanel>
  </TabProvider>
);
```
