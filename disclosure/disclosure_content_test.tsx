import { assertSnapshot, describe, it, setupJSDOM } from "../dev_deps.ts";
import { ReactElement } from "react";
import DisclosureContent from "./disclosure_content.ts";
import DisclosureProvider from "./disclosure_provider.ts";
import SSRProvider from "../ssr/ssr_provider.ts";
import { render } from "@testing-library/react";

const describeTests = describe({
  name: "DisclosureContent",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should be render as", (t) => {
  const { container, rerender } = render(
    <DisclosureContent>test</DisclosureContent>,
    {
      wrapper: ({ children }) => (
        <SSRProvider>
          <DisclosureProvider>{children as ReactElement}</DisclosureProvider>
        </SSRProvider>
      ),
    },
  );

  assertSnapshot(t, container.innerHTML);

  rerender(<DisclosureContent as="p">test</DisclosureContent>);
  assertSnapshot(t, container.innerHTML);
  rerender(<DisclosureContent className="test">test</DisclosureContent>);
  assertSnapshot(t, container.innerHTML);

  rerender(
    <DisclosureContent style={{ display: "block" }}>test</DisclosureContent>,
  );
  assertSnapshot(t, container.innerHTML);

  rerender(
    <DisclosureContent>
      test
    </DisclosureContent>,
  );
  assertSnapshot(t, container.innerHTML);
});

it(describeTests, "should be render if disclosure open", (t) => {
  const { container } = render(
    <DisclosureContent>test</DisclosureContent>,
    {
      wrapper: ({ children }) => (
        <SSRProvider>
          <DisclosureProvider isDefaultOpen>
            {children as ReactElement}
          </DisclosureProvider>
        </SSRProvider>
      ),
    },
  );

  assertSnapshot(t, container.innerHTML);
});
