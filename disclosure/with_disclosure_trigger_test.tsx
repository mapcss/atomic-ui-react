import WithDisclosureTrigger from "./with_disclosure_trigger.ts";
import Disclosure from "./disclosure_provider.ts";
import SSRProvider from "../ssr/ssr_provider.ts";
import {
  anyBoolean,
  anyFunction,
  anyString,
  assertSnapshot,
  describe,
  expect,
  fn,
  it,
  setupJSDOM,
} from "../dev_deps.ts";
import { fireEvent, render } from "@testing-library/react";

const describeTests = describe({
  name: "WithDisclosureTrigger",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should throw error when it not wrap Context", () => {
  expect(() =>
    render(
      <WithDisclosureTrigger>
        <p>test</p>
      </WithDisclosureTrigger>,
    )
  ).toThrow();
});

it(
  describeTests,
  "should trigger click event by default",
  (t) => {
    const { baseElement, getByTestId } = render(
      <WithDisclosureTrigger>
        <p data-testid="test">test</p>
      </WithDisclosureTrigger>,
      {
        wrapper: ({ children }) => {
          return (
            <SSRProvider>
              <Disclosure>{children as never}</Disclosure>
            </SSRProvider>
          );
        },
      },
    );

    assertSnapshot(t, baseElement.innerHTML);

    const el = getByTestId("test");

    fireEvent.click(el);
    assertSnapshot(t, baseElement.innerHTML);

    fireEvent.click(el);
    assertSnapshot(t, baseElement.innerHTML);
  },
);

it(
  describeTests,
  "should change trigger event",
  (t) => {
    const { baseElement, getByTestId } = render(
      <WithDisclosureTrigger on={["onMouseEnter", "onMouseLeave"]}>
        <div data-testid="test">test</div>
      </WithDisclosureTrigger>,
      {
        wrapper: ({ children }) => {
          return (
            <SSRProvider>
              <Disclosure>{children as never}</Disclosure>
            </SSRProvider>
          );
        },
      },
    );

    const el = getByTestId("test");

    fireEvent.click(el);
    assertSnapshot(t, baseElement.innerHTML);

    fireEvent.mouseEnter(el);
    assertSnapshot(t, baseElement.innerHTML);

    fireEvent.mouseLeave(el);
    assertSnapshot(t, baseElement.innerHTML);
  },
);

it(
  describeTests,
  "should pass context as render children",
  () => {
    const mockFn = fn();
    render(
      <WithDisclosureTrigger>
        {(props, context) => {
          mockFn(props);
          mockFn(context);
          return <></>;
        }}
      </WithDisclosureTrigger>,
      {
        wrapper: ({ children }) => {
          return (
            <SSRProvider>
              <Disclosure>{children as never}</Disclosure>
            </SSRProvider>
          );
        },
      },
    );

    expect(mockFn).toHaveBeenCalledWith({
      "aria-controls": anyString(),
      "aria-expanded": anyBoolean(),
      onClick: anyFunction(),
    });
    expect(mockFn).toHaveBeenCalledWith({
      id: anyString(),
      isOpen: anyBoolean(),
      toggle: anyFunction(),
      open: anyFunction(),
      close: anyFunction(),
    });
  },
);

it(
  describeTests,
  "should pass event handler props as render children",
  () => {
    const mockFn = fn();
    render(
      <WithDisclosureTrigger on={["onAbort", "onChange"]}>
        {(props) => {
          mockFn(props);
          return <></>;
        }}
      </WithDisclosureTrigger>,
      {
        wrapper: ({ children }) => {
          return (
            <SSRProvider>
              <Disclosure>{children as never}</Disclosure>
            </SSRProvider>
          );
        },
      },
    );

    expect(mockFn).toHaveBeenCalledWith({
      "aria-controls": anyString(),
      "aria-expanded": anyBoolean(),
      onAbort: anyFunction(),
      onChange: anyFunction(),
    });
  },
);

it(
  describeTests,
  "should render as children",
  (t) => {
    const { baseElement } = render(
      <WithDisclosureTrigger>
        {(props, { isOpen }) => {
          return (
            <span
              {...props}
              className={isOpen ? "i-mdi-chevron-up" : "i-mdi-chevron-down"}
            />
          );
        }}
      </WithDisclosureTrigger>,
      {
        wrapper: ({ children }) => {
          return (
            <SSRProvider>
              <Disclosure>{children as never}</Disclosure>
            </SSRProvider>
          );
        },
      },
    );
    assertSnapshot(t, baseElement.innerHTML);
  },
);
