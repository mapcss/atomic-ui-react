import { cleanCharacter, joinChars } from "./deps.ts";
import { expect, ParamReturn } from "./dev_deps.ts";

Deno.test("joinChars", () => {
  const table: ParamReturn<typeof joinChars>[] = [
    [[""], " ", ""],
    [[undefined], " ", ""],
    [[undefined, undefined], " ", ""],
    [[undefined, undefined, ""], " ", ""],
    [[" "], " ", ""],
    [[undefined, undefined, " "], " ", ""],
    [["test"], " ", "test"],
    [[" test "], " ", "test"],
    [["test", "test2"], " ", "test test2"],
    [[" test ", "tes t"], " ", "test tes t"],
    [
      ["", "a", " b", undefined, "c ", " d ", " ef g ", undefined],
      " ",
      "a b c d ef g",
    ],
    [
      ["ab", "ab"],
      " ",
      "ab ab",
    ],
    [
      ["id", undefined, "2 "],
      "-",
      "id-2",
    ],
    [
      ["id", undefined, "2", " "],
      "-",
      "id-2",
    ],
    [
      ["id", undefined, "    ", "2", " ", "  3 "],
      "-",
      "id-2-3",
    ],
    [
      [0, 1, "2", "3"],
      "-",
      "0-1-2-3",
    ],
  ];
  table.forEach(([value, separator, result]) =>
    expect(joinChars(value, separator)).toBe(result)
  );
});

Deno.test("cleanCharacter", () => {
  const table: ParamReturn<typeof cleanCharacter>[] = [
    ["", ""],
    ["   ", ""],
    ["This  is sunny !   ", "This is sunny !"],
  ];

  table.forEach(([value, result]) =>
    expect(cleanCharacter(value)).toBe(result)
  );
});
