/**
 * @jest-environment node
 */

import { useEffect } from "react";
import { useIsomorphicLayoutEffect } from "./layout-effect.hook";

describe("useIsomorphicLayoutEffect (SSR)", () => {
  it("should return useEffect from the server", () => {
    expect(useIsomorphicLayoutEffect).toBe(useEffect);
  });
});
