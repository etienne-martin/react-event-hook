import { generateRandomNumber } from "./random-number";

describe("random number", () => {
  it("should generate a random number", () => {
    expect(generateRandomNumber()).toEqual(expect.any(Number));
    expect(generateRandomNumber()).toBeGreaterThan(0);
  });
});
