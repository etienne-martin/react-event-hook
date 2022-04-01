import { deserializeEvent, serializeEvent } from "./event-serializer";

describe("event serializer", () => {
  const payloads = [{ hello: "world" }, [], undefined, false, null, 1];

  describe("serialize", () => {
    it.each(payloads)("should serialize %p", (payload) => {
      expect(JSON.parse(serializeEvent("ping", payload))).toEqual({
        id: expect.any(String),
        name: "ping",
        payload,
      });
    });

    // TODO: implement this missing check
    it.skip("should throw an error when passing unserializable values", () => {
      expect(() => serializeEvent("ping", new Map())).toThrow();
    });
  });

  describe("deserialize", () => {
    it.each(payloads)("should deserialize %p", (payload) => {
      expect(deserializeEvent(serializeEvent("ping", payload))).toEqual({
        name: "ping",
        payload,
      });
    });
  });
});
