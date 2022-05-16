/**
 * @jest-environment node
 */

import { canUseDom } from "./dom";

describe("dom (SSR)", () => {
  it("should return false from the server", () => {
    expect(canUseDom).toEqual(false);
  });
});
