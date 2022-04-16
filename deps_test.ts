import { isBrowser } from "./deps.ts";
import { expect } from "./dev_deps.ts";

Deno.test("isBrowser", () => {
  expect(isBrowser).toBeFalsy();
});
