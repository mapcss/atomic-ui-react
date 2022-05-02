import WithDisclosureTarget from "./with_disclosure_target.ts";
import Disclosure from "./disclosure.ts";
import SSRProvider from "../ssr/ssr_provider.ts";
import {
  assertSnapshot,
  describe,
  expect,
  it,
  setupJSDOM,
} from "../dev_deps.ts";
import { render } from "@testing-library/react";

const describeTests = describe({
  name: "WithDisclosureTarget",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should throw error when it not wrap Context", () => {
  expect(() =>
    render(
      <WithDisclosureTarget>
        <p>test</p>
      </WithDisclosureTarget>,
    )
  ).toThrow();
});

it(
  describeTests,
  "should render with style when the internal `isOpen` is false",
  (t) => {
    const { baseElement } = render(
      <WithDisclosureTarget>
        <p>test</p>
      </WithDisclosureTarget>,
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
    <WithDisclosureTarget>
      <p>test</p>
    </WithDisclosureTarget>,
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
    <WithDisclosureTarget
      closedStyle={{
        visibility: "hidden",
      }}
    >
      <p>test</p>
    </WithDisclosureTarget>,
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

it(describeTests, "should merge style", (t) => {
  const { baseElement } = render(
    <WithDisclosureTarget>
      <p style={{ font: "icon" }}>test</p>
    </WithDisclosureTarget>,
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
