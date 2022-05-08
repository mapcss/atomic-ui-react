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
  Tab,
  TabList,
  TabPanel,
  TabProvider,
} from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";

export default () => (
  <TabProvider>
    <TabList>
      <div>
        <Tab>
          <button>Title 1</button>
        </Tab>
        <Tab>
          <button>Title 2</button>
        </Tab>
      </div>
    </TabList>

    <TabPanel>
      <div>Content 1</div>
    </TabPanel>
    <TabPanel>
      <div>Content 2</div>
    </TabPanel>
  </TabProvider>
);
```
