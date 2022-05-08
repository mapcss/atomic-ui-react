import DisclosureProvider from "./disclosure_provider.ts";
import SSRProvider from "../ssr/ssr_provider.ts";
import { render } from "@testing-library/react";
import { assertSnapshot, describe, it, setupJSDOM } from "../dev_deps.ts";

const describeTests = describe({
  name: "DisclosureProvider",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should render as", (t) => {
  const { baseElement } = render(
    <DisclosureProvider>
      <div>test</div>
    </DisclosureProvider>,
    { wrapper: SSRProvider as never },
  );

  assertSnapshot(t, baseElement.innerHTML);
});
