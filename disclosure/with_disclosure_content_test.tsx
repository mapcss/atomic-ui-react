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
        {(attrs) => <p {...attrs}>test</p>}
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
        {(attrs) => <p {...attrs}>test</p>}
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
      {(attrs) => <p {...attrs}>test</p>}
    </WithDisclosureContent>,
    {
      wrapper: ({ children }) => {
        return (
          <SSRProvider>
            <Disclosure initialIsOpen>{children as never}</Disclosure>
          </SSRProvider>
        );
      },
    },
  );

  assertSnapshot(t, container.innerHTML);
});
