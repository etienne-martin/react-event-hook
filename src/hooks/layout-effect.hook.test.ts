import { useLayoutEffect } from "react";
import { useIsomorphicLayoutEffect } from "./layout-effect.hook";

describe("useIsomorphicLayoutEffect", () => {
  it("should return useLayoutEffect from the client", () => {
    expect(useIsomorphicLayoutEffect).toBe(useLayoutEffect);
  });
});
