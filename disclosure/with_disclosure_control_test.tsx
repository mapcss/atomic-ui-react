import WithDisclosureControl from "./with_disclosure_control.ts";
import Disclosure from "./disclosure_provider.ts";
import SSRProvider from "../ssr/ssr_provider.ts";
import {
  anyBoolean,
  anyFunction,
  anyOf,
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
  name: "WithDisclosureControl",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should throw error when it not wrap Context", () => {
  expect(() =>
    render(
      <WithDisclosureControl>
        {(attrs) => <p {...attrs}>test</p>}
      </WithDisclosureControl>,
    )
  ).toThrow();
});

it(
  describeTests,
  "should trigger click event by default",
  (t) => {
    const { container, getByTestId } = render(
      <WithDisclosureControl>
        {(attrs) => <p {...attrs} data-testid="test">test</p>}
      </WithDisclosureControl>,
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

    assertSnapshot(t, container.innerHTML);

    const el = getByTestId("test");

    fireEvent.click(el);
    assertSnapshot(t, container.innerHTML);

    fireEvent.click(el);
    assertSnapshot(t, container.innerHTML);
  },
);

it(
  describeTests,
  "should pass context as render children",
  () => {
    const mockFn = fn();
    render(
      <WithDisclosureControl>
        {(props, context) => {
          mockFn(props);
          mockFn(context);
          return <></>;
        }}
      </WithDisclosureControl>,
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
      role: "button",
      onClick: anyFunction(),
      onKeyDown: anyFunction(),
    });
    expect(mockFn).toHaveBeenCalledWith({
      id: anyString(),
      isOpen: anyBoolean(),
      mutateType: anyOf(["toggle", "off", "on"]),
      mutateValue: anyBoolean(),
      setIsOpen: anyFunction(),
    });
  },
);

it(
  describeTests,
  "should pass event handler props as render children",
  () => {
    const mockFn = fn();
    render(
      <WithDisclosureControl
        onAbort={() => {}}
        onChange={() => {}}
        onClick={undefined}
      >
        {(props) => {
          mockFn(props);
          return <></>;
        }}
      </WithDisclosureControl>,
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
      role: "button",
      onAbort: anyFunction(),
      onClick: undefined,
      onChange: anyFunction(),
      onKeyDown: anyFunction(),
    });
  },
);

it(
  describeTests,
  "should render as children",
  (t) => {
    const { container } = render(
      <WithDisclosureControl>
        {(props, { isOpen }) => {
          return (
            <span
              {...props}
              className={isOpen ? "i-mdi-chevron-up" : "i-mdi-chevron-down"}
            />
          );
        }}
      </WithDisclosureControl>,
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
    assertSnapshot(t, container.innerHTML);
  },
);
