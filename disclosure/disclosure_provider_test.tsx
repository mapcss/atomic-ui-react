import DisclosureProvider from "./disclosure_provider.ts";
import SSRProvider from "../ssr/ssr_provider.ts";
import { fireEvent, render } from "@testing-library/react";
import { assertSnapshot, describe, it, setupJSDOM } from "../dev_deps.ts";

const describeTests = describe({
  name: "DisclosureProvider",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should render as", (t) => {
  const { baseElement, getByTestId } = render(
    <DisclosureProvider>
      {({ isOpen, id, toggle }) => (
        <>
          <button
            data-testid="toggle"
            aria-controls={id}
            aria-expanded={isOpen}
            onClick={toggle}
          >
            toggle
          </button>

          {isOpen && <p id={id}>test</p>}
        </>
      )}
    </DisclosureProvider>,
    { wrapper: SSRProvider as never },
  );

  assertSnapshot(t, baseElement.innerHTML);

  const el = getByTestId("toggle");
  fireEvent.click(el);

  assertSnapshot(t, baseElement.innerHTML);
});
