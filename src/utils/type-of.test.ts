import { getTypeOf } from "./type-of";

describe("getTypeOf", () => {
  it("should return the actual type of the provided value", () => {
    // Primitives
    expect(getTypeOf(true)).toEqual("boolean");
    expect(getTypeOf(null)).toEqual("null");
    expect(getTypeOf(undefined)).toEqual("undefined");
    expect(getTypeOf(123)).toEqual("number");
    expect(getTypeOf(Infinity)).toEqual("number");
    expect(getTypeOf(BigInt(Number.MAX_SAFE_INTEGER))).toEqual("bigint");
    expect(getTypeOf(NaN)).toEqual("number"); // Meh
    expect(getTypeOf("hello")).toEqual("string");
    expect(getTypeOf(Symbol("hello"))).toEqual("symbol");

    // Complex types
    expect(getTypeOf({})).toEqual("object");
    expect(getTypeOf([])).toEqual("array");
    expect(getTypeOf(() => 1)).toEqual("function");
    expect(getTypeOf(/hello/)).toEqual("regexp");
    expect(getTypeOf(new Date())).toEqual("date");
    expect(getTypeOf(new Map())).toEqual("map");
    expect(getTypeOf(new Set())).toEqual("set");
    expect(getTypeOf(new Error())).toEqual("error");
  });
});
