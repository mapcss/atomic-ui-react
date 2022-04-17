# tab

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
      <Tab>Title 1</Tab>
      <Tab>Title 2</Tab>
    </TabList>

    <TabPanel>Content 1</TabPanel>
    <TabPanel>Content 2</TabPanel>
  </TabProvider>
);
```
