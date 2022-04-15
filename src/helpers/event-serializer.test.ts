import { deserializeEvent, serializeEvent } from "./event-serializer";

describe("event serializer", () => {
  it("should serialize event", () => {
    expect(JSON.parse(serializeEvent("ping", { hello: "world" }))).toEqual({
      id: expect.any(String),
      name: "ping",
      payload: { hello: "world" },
    });
  });

  it("should deserialize event", () => {
    expect(
      deserializeEvent(serializeEvent("ping", { hello: "world" }))
    ).toEqual({
      name: "ping",
      payload: { hello: "world" },
    });
  });
});
