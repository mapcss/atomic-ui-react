# tab

- No element
- No style
- WAI-ARIA ready
- Provider and Pure Components
- Automatic unique ID with SSR friendly
- Control of selectable tabs in conjunction with `aria-disabled`

## Quick view

```tsx
import {
  Tab,
  TabList,
  TabPanel,
  TabProvider,
} from "https://deno.land/x/atomic_ui_react@$VERSION/mod.ts";
export default () => {
  return (
    <TabProvider>
      <TabList>
        <Tab>tab 1</Tab>
        <Tab>tab 2</Tab>
        <Tab>tab 3</Tab>
      </TabList>
      <TabPanel>1</TabPanel>
      <TabPanel>2</TabPanel>
      <TabPanel>3</TabPanel>
    </TabProvider>
  );
};
```

render as:

```html
<div role="tablist" aria-orientation="horizontal">
  <button
    role="tab"
    id="atomic-ui-0-tab-0"
    aria-selected="true"
    aria-controls="atomic-ui-0-tab-panel-0"
    tabindex="0"
  >
    tab 1
  </button>
  <button
    role="tab"
    id="atomic-ui-0-tab-1"
    aria-selected="false"
    aria-controls="atomic-ui-0-tab-panel-1"
    tabindex="-1"
  >
    tab 2
  </button>
  <button
    role="tab"
    id="atomic-ui-0-tab-2"
    aria-selected="false"
    aria-controls="atomic-ui-0-tab-panel-2"
    tabindex="-1"
  >
    tab 3
  </button>
</div>
<div
  role="tabpanel"
  id="atomic-ui-0-tab-panel-0"
  aria-labelledby="atomic-ui-0-tab-0"
>
  1
</div>
<div
  role="tabpanel"
  id="atomic-ui-0-tab-panel-1"
  aria-labelledby="atomic-ui-0-tab-1"
  hidden=""
>
  2
</div>
<div
  role="tabpanel"
  id="atomic-ui-0-tab-panel-2"
  aria-labelledby="atomic-ui-0-tab-2"
  hidden=""
>
  3
</div>
```
