import { deserializeEvent, serializeEvent } from "./event-serializer";

describe("event serializer", () => {
  const events = [{ hello: "world" }, [], undefined, false, null, 1];

  describe("serialize", () => {
    it.each(events)("should serialize %p", (event) => {
      expect(JSON.parse(serializeEvent(event))).toEqual({
        timestamp: expect.any(Number),
        event,
      });
    });

    // TODO: implement this missing check
    it.skip("should throw an error when passing unserializable values", () => {
      expect(() => serializeEvent(new Map())).toThrow();
    });
  });

  describe("deserialize", () => {
    it.each(events)("should deserialize %p", (event) => {
      expect(deserializeEvent(serializeEvent(event))).toEqual(event);
    });
  });
});
