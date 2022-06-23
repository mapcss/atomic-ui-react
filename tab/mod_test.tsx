import { Tab, TabList, TabPanel, TabProvider } from "./mod.ts";
import { assertSnapshot, describe, it, setupJSDOM } from "../dev_deps.ts";
import { render } from "@testing-library/react";
import { SSRProvider } from "../ssr/mod.ts";

const describeTests = describe({
  name: "Tab",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should render as", (t) => {
  const { container } = render(
    <TabProvider>
      <TabList>
        <Tab>tab 1</Tab>
        <Tab>tab 2</Tab>
        <Tab>tab 3</Tab>
      </TabList>
      <TabPanel>1</TabPanel>
      <TabPanel>2</TabPanel>
      <TabPanel>3</TabPanel>
    </TabProvider>,
    {
      wrapper: ({ children }) => <SSRProvider>{children as never}</SSRProvider>,
    },
  );

  assertSnapshot(t, container.innerHTML);
});
