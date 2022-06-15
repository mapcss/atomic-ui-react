import AlertDialog from "./alert_dialog.ts";
import SSRProvider from "../ssr/ssr_provider.ts";
import { render } from "@testing-library/react";
import { assertSnapshot, describe, it, setupJSDOM } from "../dev_deps.ts";

const describeTests = describe({
  name: "AlertDialog",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should render as default", (t) => {
  const { container, rerender } = render(
    <AlertDialog />,
    {
      wrapper: ({ children }) => (
        <SSRProvider>
          {children as never}
        </SSRProvider>
      ),
    },
  );

  assertSnapshot(t, container.innerHTML);

  rerender(<AlertDialog isShowSet={[true, () => {}]} />);
  assertSnapshot(t, container.innerHTML);
});

it(describeTests, "should render as custom tag", (t) => {
  const { container, rerender } = render(
    <AlertDialog as="dialog" initialIsShow />,
    {
      wrapper: ({ children }) => (
        <SSRProvider>
          {children as never}
        </SSRProvider>
      ),
    },
  );

  assertSnapshot(t, container.innerHTML);

  rerender(<AlertDialog as="span" initialIsShow />);
  assertSnapshot(t, container.innerHTML);
});
