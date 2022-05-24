import {
  cleanCharacter,
  cleanTokens,
  isBrowser,
  joinChars,
  mergeProps,
  omitRef,
  tokenize,
} from "./util.ts";
import {
  describe,
  expect,
  fn,
  it,
  ParamReturn,
  setupJSDOM,
} from "./dev_deps.ts";
import { resolveElementLike } from "./util.ts";

Deno.test("isBrowser", () => {
  expect(isBrowser).toBeFalsy();
});

const resolveElementTest = describe({
  name: "resolveElementLike",
  beforeAll: setupJSDOM,
});

it(resolveElementTest, "should return element or undefined/null", () => {
  const el = globalThis.document.createElement("div");
  expect(resolveElementLike(null)).toBe(null);
  expect(resolveElementLike(undefined)).toBe(undefined);
  expect(resolveElementLike(el)).toEqual(el);
  expect(resolveElementLike(() => el)).toEqual(el);
  expect(resolveElementLike(() => undefined)).toBe(undefined);
  expect(resolveElementLike({ current: el })).toEqual(el);
});

Deno.test("joinChars", () => {
  const table: ParamReturn<typeof joinChars>[] = [
    [[""], " ", undefined],
    [[undefined], " ", undefined],
    [[undefined, undefined], " ", undefined],
    [[undefined, undefined, ""], " ", undefined],
    [[" "], " ", undefined],
    [[undefined, undefined, " "], " ", undefined],
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

Deno.test("tokenize", () => {
  const table: ParamReturn<typeof tokenize>[] = [
    ["", []],
    [" ", []],
    ["       ", []],
    ["a", ["a"]],
    ["a b", ["a", "b"]],
    ["   a b,  c  d  ,e ", ["a", "b,", "c", "d", ",e"]],
    [" a a b b ", ["a", "a", "b", "b"]],
  ];
  table.forEach(([value, result]) => expect(tokenize(value)).toEqual(result));
});

Deno.test("cleanTokens", () => {
  const table: ParamReturn<typeof cleanTokens>[] = [
    [[], []],
    [[""], []],
    [[undefined], []],
    [[undefined, "a", undefined], ["a"]],
    [["       ", "      "], []],
    [["a"], ["a"]],
    [["a", "b"], ["a", "b"]],
    [["a a a", "b"], ["a", "b"]],
    [["  a  b  c  ", "b", " cd ef ghi ", " jkl "], [
      "a",
      "b",
      "c",
      "cd",
      "ef",
      "ghi",
      "jkl",
    ]],
  ];
  table.forEach(([value, result]) =>
    expect(cleanTokens(value)).toEqual(result)
  );
});

Deno.test("mergeProps", () => {
  const table: ParamReturn<typeof mergeProps>[] = [
    [{}, {}, {}],
    [{ "": "" }, {}, { "": "" }],
    [{ "": "abc" }, { "": "def" }, { "": "def" }],
    [{ "": "" }, { "": 1 }, { "": 1 }],
    [{ a: "b", c: "d" }, { e: "f", g: "h" }, {
      a: "b",
      c: "d",
      e: "f",
      g: "h",
    }],
    [{ className: "" }, { className: "" }, { className: "" }],
    [{ className: "" }, { className: undefined }, { className: "" }],
    [{ className: undefined }, { className: "" }, { className: "" }],
    [{ className: undefined }, { className: undefined }, {
      className: undefined,
    }],
    [{ className: "test" }, { className: "test" }, { className: "test" }],
    [{ className: "test test2" }, { className: "test" }, {
      className: "test test2",
    }],
    [{ className: "  test   test2   " }, { className: "   test3 test4    " }, {
      className: "test test2 test3 test4",
    }],
    [{ style: { display: "none" } }, { style: { visibility: "visible" } }, {
      style: { display: "none", visibility: "visible" },
    }],
    [{ style: { display: "none" } }, { style: { display: "block" } }, {
      style: { display: "block" },
    }],
  ];

  table.forEach(([a, b, result]) => expect(mergeProps(a, b)).toEqual(result));
});

Deno.test("mergeProps: merge event handler", () => {
  const onClick1 = fn();
  const onClick2 = fn();

  const props = mergeProps({ onClick: onClick1 }, { onClick: onClick2 });

  expect(onClick1).not.toHaveBeenCalled();
  expect(onClick2).not.toHaveBeenCalled();
  props.onClick(1);
  expect(onClick1).toHaveBeenCalledWith(1);
  expect(onClick2).toHaveBeenCalledWith(1);
});

Deno.test("omitRef: no ref key from record", () => {
  expect(omitRef({})).toEqual({});
  expect(omitRef({ ref: null })).toEqual({});
  expect(omitRef({ ref: { current: null } })).toEqual({});
  expect(omitRef({ ref: null, a: "b" })).toEqual({ a: "b" });
});
