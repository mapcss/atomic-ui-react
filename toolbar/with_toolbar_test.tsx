import WithToolbar from "./with_toolbar.ts";
import WithToolbarItem from "./with_toolbar_item.ts";
import {
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
import SSRProvider from "../ssr/ssr_provider.ts";
import ToolbarProvider from "./toolbar_provider.ts";

const describeTests = describe({
  name: "WithToolbar",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should render as", (t) => {
  const mockFn = fn();
  const { container } = render(
    <WithToolbar>
      {(attributes, contexts) => {
        mockFn(attributes);
        mockFn(contexts);
        return (
          <div {...attributes}>
            <button>1</button>
          </div>
        );
      }}
    </WithToolbar>,
    {
      wrapper: ({ children }) => (
        <SSRProvider>
          <ToolbarProvider>{children as never}</ToolbarProvider>
        </SSRProvider>
      ),
    },
  );

  assertSnapshot(t, container.innerHTML);
  expect(mockFn).toHaveBeenCalledWith({
    role: "toolbar",
    onKeyDown: anyFunction(),
  });
  expect(mockFn).toHaveBeenCalledWith({
    itemsRef: anyObject(),
    activeIndex: anyNumber(),
    setActiveIndex: anyFunction(),
  });
});

it(
  describeTests,
  "should render as when fire keydown event as default",
  (t) => {
    Object.defineProperty(window, "IntersectionObserver", {
      value: {},
      configurable: true,
    });

    const { container, getByTestId } = render(
      <WithToolbar>
        {(attributes) => {
          return (
            <div {...attributes} data-testid="toolbar">
              <WithToolbarItem>
                {(attrs) => <div data-testid="item1" {...attrs}>1</div>}
              </WithToolbarItem>
              <WithToolbarItem>
                {(attrs) => <div data-testid="item2" {...attrs}>2</div>}
              </WithToolbarItem>
            </div>
          );
        }}
      </WithToolbar>,
      {
        wrapper: ({ children }) => (
          <SSRProvider>
            <ToolbarProvider>{children as never}</ToolbarProvider>
          </SSRProvider>
        ),
      },
    );

    assertSnapshot(t, container.innerHTML);

    const toolbar = getByTestId("toolbar");
    const item1 = getByTestId("item1");
    const item2 = getByTestId("item2");

    fireEvent.keyDown(toolbar, {
      code: "ArrowRight",
    });
    assertSnapshot(t, container.innerHTML);
    expect(item2).toHaveFocus();

    fireEvent.keyDown(toolbar, {
      code: "ArrowRight",
    });
    assertSnapshot(t, container.innerHTML);
    expect(item1).toHaveFocus();
  },
);
