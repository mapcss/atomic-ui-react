import DisclosureTarget from "./disclosure_target.ts";
import Disclosure from "./disclosure.ts";
import SSRProvider from "../ssr/ssr_provider.ts";
import { createElement, Fragment } from "react";
import {
  assertSnapshot,
  describe,
  expect,
  it,
  setupJSDOM,
} from "../dev_deps.ts";
import { render } from "@testing-library/react";

const describeTests = describe({
  name: "DisclosureTarget",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should throw error when it not wrap Context", () => {
  expect(() => render(<DisclosureTarget>test</DisclosureTarget>)).toThrow();
});

it(
  describeTests,
  "should render with style when the internal `isOpen` is false",
  (t) => {
    const { baseElement } = render(
      <DisclosureTarget>test</DisclosureTarget>,
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

it(describeTests, "should render when the internal `isOpen` is true", (t) => {
  const { baseElement } = render(
    <DisclosureTarget>test</DisclosureTarget>,
    {
      wrapper: ({ children }) => {
        return (
          <SSRProvider>
            <Disclosure isDefaultOpen>{children as never}</Disclosure>
          </SSRProvider>
        );
      },
    },
  );

  assertSnapshot(t, baseElement.innerHTML);
});

it(describeTests, "should overwrite default closed style", (t) => {
  const { baseElement } = render(
    <DisclosureTarget
      closedStyle={{
        visibility: "hidden",
      }}
    >
      test
    </DisclosureTarget>,
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
});

it(describeTests, "should overwrite render", (t) => {
  const { baseElement } = render(
    <DisclosureTarget
      render={(props, { as, isOpen }) =>
        isOpen ? createElement(as, props) : createElement(Fragment)}
    >
      test
    </DisclosureTarget>,
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
});
