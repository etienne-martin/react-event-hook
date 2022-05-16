import { generateRandomId } from "./random-id";

describe("random id", () => {
  it("should generate a random id", () => {
    expect(generateRandomId()).toEqual(expect.any(String));
  });
});
