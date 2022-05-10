import WithDisclosureContent from "./with_disclosure_content.ts";
import Disclosure from "./disclosure_provider.ts";
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
  name: "WithDisclosureContent",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should throw error when it not wrap Context", () => {
  expect(() =>
    render(
      <WithDisclosureContent>
        <p>test</p>
      </WithDisclosureContent>,
    )
  ).toThrow();
});

it(
  describeTests,
  "should render with style when the internal `isOpen` is false",
  (t) => {
    const { container } = render(
      <WithDisclosureContent>
        <p>test</p>
      </WithDisclosureContent>,
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

it(describeTests, "should render when the internal `isOpen` is true", (t) => {
  const { container } = render(
    <WithDisclosureContent>
      <p>test</p>
    </WithDisclosureContent>,
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

  assertSnapshot(t, container.innerHTML);
});

it(describeTests, "should merge style", (t) => {
  const { container } = render(
    <WithDisclosureContent>
      <p style={{ font: "icon" }}>test</p>
    </WithDisclosureContent>,
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
});
