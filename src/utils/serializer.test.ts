import { deserialize, serialize } from "./serializer";

describe("serializer", () => {
  describe("serializable values", () => {
    const SERIALIZABLE_VALUES = [
      1,
      true,
      "hello",
      null,
      ["hello"],
      { hello: "world" },
      undefined,
    ];

    it.each(SERIALIZABLE_VALUES)("should serialize %p", (value) => {
      expect(deserialize(serialize(value))).toEqual(value);
      expect(deserialize(serialize([value]))).toEqual([value]);
      expect(deserialize(serialize({ nested: value }))).toEqual({
        nested: value,
      });
    });
  });

  describe("non-serialize values", () => {
    const NON_SERIALIZABLE_VALUES = [
      new Map(),
      NaN,
      Infinity,
      () => 1,
      /hello/,
      new Date(),
      new Map(),
      new Set(),
      new Error(),
      Symbol("hello"),
      BigInt(Number.MAX_SAFE_INTEGER),
    ];

    it.each(NON_SERIALIZABLE_VALUES)(
      "should throw an error when attempting to serialize %p",
      (value) => {
        expect(() => serialize(value)).toThrowError();
        expect(() => serialize([value])).toThrowError();
        expect(() => serialize({ nested: value })).toThrowError(
          "The input value could not be serialized"
        );
      }
    );
  });
});
