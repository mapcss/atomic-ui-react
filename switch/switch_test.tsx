import Switch from "./switch.ts";
import { assertSnapshot, describe, it, setupJSDOM } from "../dev_deps.ts";
import { render } from "@testing-library/react";

const describeTests = describe({
  name: "Switch",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should render as", (t) => {
  const { container } = render(
    <Switch isCheckedSet={[true, () => {}]}>
      button
    </Switch>,
  );

  assertSnapshot(t, container.innerHTML);
});
