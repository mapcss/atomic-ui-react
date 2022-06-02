import { Dialog, DialogDescribe, DialogTitle } from "./mod.ts";
import { assertSnapshot, describe, it, setupJSDOM } from "../dev_deps.ts";
import { render } from "@testing-library/react";
import SSRProvider from "../ssr/ssr_provider.ts";

const describeTests = describe({
  name: "Dialog E2E test",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should be render as", (t) => {
  const { container } = render(
    <Dialog initialIsShow hasDescribe hasTitle>
      <DialogTitle>Title</DialogTitle>
      <DialogDescribe>Describe it</DialogDescribe>

      <button>Cancel</button>
    </Dialog>,
    {
      wrapper: ({ children }) => <SSRProvider>{children as never}</SSRProvider>,
    },
  );

  assertSnapshot(t, container.innerHTML);
});
