import { expectType } from "tsd";
import { capitalize } from "./capitalize";

describe("capitalize", () => {
  it("should capitalize the provided string", () => {
    expect(capitalize("hello")).toEqual("Hello");
    expect(capitalize("h")).toEqual("H");
    expect(capitalize("")).toEqual("");
    expectType<"Hello">(capitalize("hello"));
  });
});
