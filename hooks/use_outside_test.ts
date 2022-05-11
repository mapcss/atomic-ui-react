import useOutside from "./use_outside.ts";
import { describe, expect, fn, it, setupJSDOM } from "../dev_deps.ts";
import { renderHook } from "@testing-library/react-hooks";
import { fireEvent } from "@testing-library/react";

const describeTests = describe({
  name: "useOutside",
  async beforeEach() {
    await setupJSDOM();
  },
});

it(describeTests, "should fire event when outside element is fired", () => {
  const mockFn = fn();
  const target = document.createElement("div");
  const inner = document.createElement("div");
  const wrapper = document.createElement("div");
  target.appendChild(inner);
  wrapper.appendChild(target);
  document.body.appendChild(wrapper);

  const { unmount } = renderHook(() =>
    useOutside({
      callback: mockFn,
      event: "click",
      target,
    })
  );

  fireEvent.click(document, { bubbles: true, cancelable: false });
  expect(mockFn).toHaveBeenCalledTimes(1);
  fireEvent.click(wrapper, { bubbles: true, cancelable: false });
  expect(mockFn).toHaveBeenCalledTimes(2);
  fireEvent.click(target, { bubbles: true, cancelable: false });
  expect(mockFn).toHaveBeenCalledTimes(2);
  fireEvent.click(inner, { bubbles: true, cancelable: false });
  expect(mockFn).toHaveBeenCalledTimes(2);
  unmount();
  fireEvent.click(document, { bubbles: true, cancelable: false });
  expect(mockFn).toHaveBeenCalledTimes(2);
});
