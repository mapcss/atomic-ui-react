import WithToolbarItem from "./with_toolbar_item.ts";
import ToolbarProvider from "./toolbar_provider.ts";
import {
  anyBoolean,
  anyFunction,
  anyNumber,
  anyObject,
  assertSnapshot,
  describe,
  expect,
  fn,
  it,
  setupJSDOM,
} from "../dev_deps.ts";
import { fireEvent, render } from "@testing-library/react";

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
          <button>1</button>
        </WithToolbarItem>,
      )
    ).toThrow();
  },
);

it(describeTests, "should render as", (t) => {
  const { container } = render(
    <>
      <WithToolbarItem>
        <button>1</button>
      </WithToolbarItem>
      <WithToolbarItem>
        <button>2</button>
      </WithToolbarItem>
    </>,
    {
      wrapper: ({ children }) => (
        <ToolbarProvider>
          {children as never}
        </ToolbarProvider>
      ),
    },
  );

  assertSnapshot(t, container.innerHTML);
});

it(describeTests, "should focus on keydown and change tabIndex", (t) => {
  const { getByTestId } = render(
    <>
      <WithToolbarItem>
        <button data-testid="test1">1</button>
      </WithToolbarItem>
      <WithToolbarItem>
        <button data-testid="test2">2</button>
      </WithToolbarItem>
    </>,
    {
      wrapper: ({ children }) => (
        <ToolbarProvider>
          {children as never}
        </ToolbarProvider>
      ),
    },
  );

  const test1 = getByTestId("test1");
  const test2 = getByTestId("test2");

  expect(test1).toHaveAttribute("tabindex", "0");
  expect(test2).toHaveAttribute("tabindex", "-1");

  test1.focus();

  fireEvent.keyDown(document.activeElement!, {
    code: "ArrowRight",
  });

  expect(test1).toHaveAttribute("tabindex", "-1");
  expect(test2).toHaveAttribute("tabindex", "0");
  expect(test2).toHaveFocus();

  fireEvent.keyDown(document.activeElement!, {
    code: "ArrowRight",
  });

  expect(test1).toHaveAttribute("tabindex", "0");
  expect(test2).toHaveAttribute("tabindex", "-1");
  expect(test1).toHaveFocus();
});

it(describeTests, "should render as children", (t) => {
  const mockFn = fn();
  const { container } = render(
    <>
      <WithToolbarItem>
        {(attributes, context) => {
          mockFn(attributes);
          mockFn(context);
          return <button {...attributes}>1</button>;
        }}
      </WithToolbarItem>
      <WithToolbarItem>
        {(attributes) => {
          return <button {...attributes}>2</button>;
        }}
      </WithToolbarItem>
    </>,
    {
      wrapper: ({ children }) => (
        <ToolbarProvider>
          {children as never}
        </ToolbarProvider>
      ),
    },
  );

  assertSnapshot(t, container.innerHTML);

  expect(mockFn).toHaveBeenCalledWith({
    tabIndex: anyNumber(),
    onKeyDown: anyFunction(),
    onFocus: anyFunction(),
    ref: anyObject(),
  });

  expect(mockFn).toHaveBeenCalledWith({
    isFirst: anyBoolean(),
    isActive: anyBoolean(),
    focusPrev: anyFunction(),
    focusNext: anyFunction(),
    focusFirst: anyFunction(),
    focusLast: anyFunction(),
  });
});
