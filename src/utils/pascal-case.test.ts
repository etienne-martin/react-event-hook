import { toPascalCase } from "./pascal-case";

describe("pascal case", () => {
  it.each([
    ["camelCase", "CamelCase"],
    ["PascalCase", "PascalCase"],
    ["kebab-case", "KebabCase"],
    ["snake_case", "SnakeCase"],
    ["CONSTANT_CASE", "ConstantCase"],
  ])("should convert %s to PascalCase", (input, output) => {
    expect(toPascalCase(input)).toEqual(output);
  });
});
