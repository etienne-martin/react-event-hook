import { canUseDom } from "./dom";

describe("dom", () => {
  it("should return true from the client", () => {
    expect(canUseDom).toEqual(true);
  });
});
