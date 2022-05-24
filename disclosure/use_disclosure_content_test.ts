import useDisclosureContent from "./use_disclosure_content.ts";
import { expect } from "../dev_deps.ts";
import { renderHook } from "@testing-library/react-hooks";

Deno.test("useDisclosureContent should return attributes", () => {
  const { result, rerender } = renderHook(
    ({ id, isOpen }) => useDisclosureContent({ id, isOpen }),
    {
      initialProps: {
        isOpen: true,
        id: "",
      },
    },
  );

  expect(result.current).toEqual({
    id: "",
    hidden: undefined,
  });

  rerender({ isOpen: false, id: "0" });
  expect(result.current).toEqual({
    id: "0",
    hidden: true,
  });
});
