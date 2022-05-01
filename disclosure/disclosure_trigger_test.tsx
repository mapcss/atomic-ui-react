import DisclosureTrigger from "./disclosure_trigger.ts";
import Disclosure from "./disclosure.ts";
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
  name: "DisclosureTrigger",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should throw error when it not wrap Context", () => {
  expect(() => render(<DisclosureTrigger>test</DisclosureTrigger>)).toThrow();
});

it(
  describeTests,
  "should trigger click event by default",
  (t) => {
    const { baseElement, getByTestId } = render(
      <DisclosureTrigger data-testid="test">test</DisclosureTrigger>,
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
      <DisclosureTrigger
        event={["mouseenter" as const, "mouseleave" as const]}
        data-testid="test"
      >
        test
      </DisclosureTrigger>,
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
      <DisclosureTrigger>
        {(context) => {
          mockFn(context);
          return <></>;
        }}
      </DisclosureTrigger>,
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
  "should render as children",
  (t) => {
    const { baseElement } = render(
      <DisclosureTrigger>
        {({ isOpen }) => {
          return (
            <span
              className={isOpen ? "i-mdi-chevron-up" : "i-mdi-chevron-down"}
            />
          );
        }}
      </DisclosureTrigger>,
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
