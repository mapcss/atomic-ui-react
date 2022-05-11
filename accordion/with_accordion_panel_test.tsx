import { assertSnapshot, describe, it, setupJSDOM } from "../dev_deps.ts";
import { ReactNode } from "react";
import SSRProvider from "../ssr/ssr_provider.ts";
import WithAccordionPanel from "./with_accordion_panel.ts";
import AccordionProvider from "./accordion_provider.ts";
import { render } from "@testing-library/react";

const describeTests = describe({
  name: "WithAccordionPanel",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should render as", (t) => {
  const { container } = render(
    <>
      <WithAccordionPanel>
        <div>test1</div>
      </WithAccordionPanel>
      <WithAccordionPanel>
        <div>test2</div>
      </WithAccordionPanel>
    </>,
    {
      wrapper: ({ children }) => (
        <SSRProvider>
          <AccordionProvider>{children as ReactNode}</AccordionProvider>
        </SSRProvider>
      ),
    },
  );

  assertSnapshot(t, container.innerHTML);
});
