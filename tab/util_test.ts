import {
  getFirstIndex,
  getLastIndex,
  getNextIndex,
  getPrevIndex,
} from "./util.ts";
import { expect, ParamReturn } from "../dev_deps.ts";

Deno.test("getNextIndex", () => {
  const table: ParamReturn<typeof getNextIndex>[] = [
    [0, [], 0],
    [0, [false], 0],
    [0, [true], 0],
    [0, [true, true], 1],
    [0, [false, false], 0],
    [0, [false, true], 1],
    [0, [true, false], 0],
    [0, [true, false, false], 0],
    [0, [true, true, false], 1],
    [0, [true, true, true], 1],
    [0, [true, false, true], 2],
    [0, [false, true, true], 1],
    [0, [false, false, true], 2],
    [0, [false, true, false], 1],
    [0, [false, false, false], 0],
    [1, [], 1],
    [1, [false], 1],
    [1, [true], 0],
    [1, [true, true], 0],
    [1, [false, false], 1],
    [1, [false, true], 1],
    [1, [true, false], 0],
    [1, [true, false, false], 0],
    [1, [true, true, false], 0],
    [1, [true, true, true], 2],
    [1, [true, false, true], 2],
    [1, [false, true, true], 2],
    [1, [false, false, true], 2],
    [1, [false, true, false], 1],
    [1, [false, false, false], 1],
    [2, [], 2],
    [2, [false], 2],
    [2, [true], 0],
    [2, [true, true], 0],
    [2, [false, false], 2],
    [2, [false, true], 1],
    [2, [true, false], 0],
    [2, [true, false, false], 0],
    [2, [true, true, false], 0],
    [2, [true, true, true], 0],
    [2, [true, false, true], 0],
    [2, [false, true, true], 1],
    [2, [false, false, true], 2],
    [2, [false, true, false], 1],
    [2, [false, false, false], 2],
  ];
  table.forEach(([currentIndex, matrix, result]) =>
    expect(getNextIndex(currentIndex, matrix)).toBe(result)
  );
});

Deno.test("getPrevIndex", () => {
  const table: ParamReturn<typeof getPrevIndex>[] = [
    [0, [], 0],
    [0, [false], 0],
    [0, [true], 0],
    [0, [true, true], 1],
    [0, [false, false], 0],
    [0, [false, true], 1],
    [0, [true, false], 0],
    [0, [true, false, false], 0],
    [0, [true, true, false], 1],
    [0, [true, true, true], 2],
    [0, [true, false, true], 2],
    [0, [false, true, true], 2],
    [0, [false, false, true], 2],
    [0, [false, true, false], 1],
    [0, [false, false, false], 0],
    [1, [], 1],
    [1, [false], 1],
    [1, [true], 0],
    [1, [true, true], 0],
    [1, [false, false], 1],
    [1, [false, true], 1],
    [1, [true, false], 0],
    [1, [true, false, false], 0],
    [1, [true, true, false], 0],
    [1, [true, true, true], 0],
    [1, [true, false, true], 0],
    [1, [false, true, true], 2],
    [1, [false, false, true], 2],
    [1, [false, true, false], 1],
    [1, [false, false, false], 1],
    [2, [], 2],
    [2, [false], 2],
    [2, [true], 0],
    [2, [true, true], 1],
    [2, [false, false], 2],
    [2, [false, true], 1],
    [2, [true, false], 0],
    [2, [true, false, false], 0],
    [2, [true, true, false], 1],
    [2, [true, true, true], 1],
    [2, [true, false, true], 0],
    [2, [false, true, true], 1],
    [2, [false, false, true], 2],
    [2, [false, true, false], 1],
    [2, [false, false, false], 2],
  ];
  table.forEach(([currentIndex, matrix, result]) =>
    expect(getPrevIndex(currentIndex, matrix)).toBe(result)
  );
});

Deno.test("getFirstIndex", () => {
  const table: ParamReturn<typeof getFirstIndex>[] = [
    [0, [], 0],
    [0, [false], 0],
    [0, [true], 0],
    [0, [true, true], 0],
    [0, [false, false], 0],
    [0, [false, true], 1],
    [0, [true, false], 0],
    [0, [true, false, false], 0],
    [0, [true, true, false], 0],
    [0, [true, true, true], 0],
    [0, [true, false, true], 0],
    [0, [false, true, true], 1],
    [0, [false, false, true], 2],
    [0, [false, true, false], 1],
    [0, [false, false, false], 0],
    [1, [], 1],
    [1, [false], 1],
    [1, [true], 0],
    [1, [true, true], 0],
    [1, [false, false], 1],
    [1, [false, true], 1],
    [1, [true, false], 0],
    [1, [true, false, false], 0],
    [1, [true, true, false], 0],
    [1, [true, true, true], 0],
    [1, [true, false, true], 0],
    [1, [false, true, true], 1],
    [1, [false, false, true], 2],
    [1, [false, true, false], 1],
    [1, [false, false, false], 1],
    [2, [], 2],
    [2, [false], 2],
    [2, [true], 0],
    [2, [true, true], 0],
    [2, [false, false], 2],
    [2, [false, true], 1],
    [2, [true, false], 0],
    [2, [true, false, false], 0],
    [2, [true, true, false], 0],
    [2, [true, true, true], 0],
    [2, [true, false, true], 0],
    [2, [false, true, true], 1],
    [2, [false, false, true], 2],
    [2, [false, true, false], 1],
    [2, [false, false, false], 2],
  ];
  table.forEach(([currentIndex, matrix, result]) =>
    expect(getFirstIndex(currentIndex, matrix)).toBe(result)
  );
});

Deno.test("getLastIndex", () => {
  const table: ParamReturn<typeof getLastIndex>[] = [
    [0, [], 0],
    [0, [false], 0],
    [0, [true], 0],
    [0, [true, true], 1],
    [0, [false, false], 0],
    [0, [false, true], 1],
    [0, [true, false], 0],
    [0, [true, false, false], 0],
    [0, [true, true, false], 1],
    [0, [true, true, true], 2],
    [0, [true, false, true], 2],
    [0, [false, true, true], 2],
    [0, [false, false, true], 2],
    [0, [false, true, false], 1],
    [0, [false, false, false], 0],
    [1, [], 1],
    [1, [false], 1],
    [1, [true], 0],
    [1, [true, true], 1],
    [1, [false, false], 1],
    [1, [false, true], 1],
    [1, [true, false], 0],
    [1, [true, false, false], 0],
    [1, [true, true, false], 1],
    [1, [true, true, true], 2],
    [1, [true, false, true], 2],
    [1, [false, true, true], 2],
    [1, [false, false, true], 2],
    [1, [false, true, false], 1],
    [1, [false, false, false], 1],
    [2, [], 2],
    [2, [false], 2],
    [2, [true], 0],
    [2, [true, true], 1],
    [2, [false, false], 2],
    [2, [false, true], 1],
    [2, [true, false], 0],
    [2, [true, false, false], 0],
    [2, [true, true, false], 1],
    [2, [true, true, true], 2],
    [2, [true, false, true], 2],
    [2, [false, true, true], 2],
    [2, [false, false, true], 2],
    [2, [false, true, false], 1],
    [2, [false, false, false], 2],
  ];
  table.forEach(([currentIndex, matrix, result]) =>
    expect(getLastIndex(currentIndex, matrix)).toBe(result)
  );
});
