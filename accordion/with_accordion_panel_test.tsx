import {
  anyBoolean,
  anyFunction,
  anyNumber,
  anyString,
  assertSnapshot,
  describe,
  expect,
  fn,
  it,
  setupJSDOM,
} from "../dev_deps.ts";
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

it(describeTests, "should render children as props", (t) => {
  const mockFn = fn();
  const { container } = render(
    <>
      <WithAccordionPanel>
        {(attrs, context) => {
          mockFn(attrs);
          mockFn(context);
          return <div {...attrs}>test</div>;
        }}
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

  expect(mockFn).toHaveBeenCalledWith({
    "hidden": anyBoolean(),
    "aria-labelledby": anyString(),
    id: anyString(),
  });

  expect(mockFn).toHaveBeenCalledWith({
    isOpen: anyBoolean(),
    open: anyFunction(),
    index: anyNumber(),
    focusFirst: anyFunction(),
    focusLast: anyFunction(),
    focusNext: anyFunction(),
    focusPrev: anyFunction(),
  });
});
