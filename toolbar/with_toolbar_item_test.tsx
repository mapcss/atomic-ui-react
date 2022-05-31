import WithToolbarItem from "./with_toolbar_item.ts";
import ToolbarProvider from "./toolbar_provider.ts";
import {
  assertSnapshot,
  describe,
  expect,
  it,
  setupJSDOM,
} from "../dev_deps.ts";
import { fireEvent, render } from "@testing-library/react";
import SSRProvider from "../ssr/ssr_provider.ts";

const describeTests = describe({
  name: "WithToolbarItem",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(
  describeTests,
  "should throw error when not wrap by ToolbarProvider",
  () => {
    expect(() =>
      render(
        <WithToolbarItem>
          {() => <div></div>}
        </WithToolbarItem>,
      )
    ).toThrow();
  },
);

it(describeTests, "should render as", (t) => {
  const { container } = render(
    <>
      <WithToolbarItem>
        {(attrs) => <div {...attrs}>1</div>}
      </WithToolbarItem>
    </>,
    {
      wrapper: ({ children }) => (
        <SSRProvider>
          <ToolbarProvider>
            {children as never}
          </ToolbarProvider>
        </SSRProvider>
      ),
    },
  );

  assertSnapshot(t, container.innerHTML);
});

it(describeTests, "should change active on fire click", (t) => {
  const { getByTestId, container } = render(
    <>
      <WithToolbarItem>
        {(attrs) => <div data-testid="item1" {...attrs}>1</div>}
      </WithToolbarItem>
      <WithToolbarItem>
        {(attrs) => <div data-testid="item2" {...attrs}>2</div>}
      </WithToolbarItem>
    </>,
    {
      wrapper: ({ children }) => (
        <SSRProvider>
          <ToolbarProvider>
            {children as never}
          </ToolbarProvider>
        </SSRProvider>
      ),
    },
  );

  const item1 = getByTestId("item1");
  const item2 = getByTestId("item2");

  assertSnapshot(t, container.innerHTML);

  fireEvent.click(item2);
  assertSnapshot(t, container.innerHTML);
  expect(item2).toHaveFocus();

  fireEvent.click(item1);
  assertSnapshot(t, container.innerHTML);
  expect(item1).toHaveFocus();
});
