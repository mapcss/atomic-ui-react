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
import WithAccordionPanel from "./with_accordion_panel.ts";
import { render } from "@testing-library/react";

const describeTests = describe({
  name: "WithAccordionPanel",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should render as", (t) => {
  const mockFn = fn();
  const { container } = render(
    <>
      <WithAccordionPanel
        contexts={{
          headerId: "header",
          index: 0,
          openIndex: 0,
          setOpenIndex: () => {},
          id: "panel",
        }}
      >
        {(attrs, contexts) => {
          mockFn(attrs);
          mockFn(contexts);
          return <div {...attrs}>test1</div>;
        }}
      </WithAccordionPanel>
    </>,
  );

  assertSnapshot(t, container.innerHTML);

  expect(mockFn).toHaveBeenCalledWith({
    "hidden": false,
    "aria-labelledby": "header",
    id: "panel",
  });

  expect(mockFn).toHaveBeenCalledWith({
    isOpen: anyBoolean(),
    index: anyNumber(),
    openIndex: anyNumber(),
    setOpenIndex: anyFunction(),
    id: anyString(),
    headerId: anyString(),
  });
});
