import { pascalCase } from "./pascal-case";

describe("pascal case", () => {
  it("should convert camelCase to PascalCase", () => {
    expect(pascalCase("camel") === "Camel").toEqual(true);
    expect(pascalCase("camelCaseText") === "CamelCaseText").toEqual(true);
  });

  it("should convert PascalCase to PascalCase", () => {
    expect(pascalCase("Pascal") === "Pascal").toEqual(true);
    expect(pascalCase("PascalCaseText") === "PascalCaseText").toEqual(true);
  });

  it("should convert kebab-case to PascalCase", () => {
    expect(pascalCase("kebab-case-text") === "KebabCaseText").toEqual(true);
    expect(pascalCase("--kebab--case--text--") === "KebabCaseText").toEqual(
      true
    );
  });

  it("should convert snake_case to PascalCase", () => {
    expect(pascalCase("snake_case_text") === "SnakeCaseText").toEqual(true);
    expect(pascalCase("__snake__case__text__") === "SnakeCaseText").toEqual(
      true
    );
  });

  it("should convert CONSTANT_CASE to PascalCase", () => {
    expect(pascalCase("CONSTANT") === "Constant").toEqual(true);
    expect(pascalCase("CONSTANT_CASE_TEXT") === "ConstantCaseText").toEqual(
      true
    );
    expect(
      pascalCase("__CONSTANT__CASE__TEXT__") === "ConstantCaseText"
    ).toEqual(true);
  });

  it("should convert colon:case to PascalCase", () => {
    expect(pascalCase("colon:case:text") === "ColonCaseText").toEqual(true);
    expect(pascalCase(":colon:case:text:") === "ColonCaseText").toEqual(true);
  });

  it("should convert slash/case to PascalCase", () => {
    expect(pascalCase("slash/case/text") === "SlashCaseText").toEqual(true);
    expect(pascalCase("/slash/case/text/") === "SlashCaseText").toEqual(true);
  });

  it("should convert dot.case to PascalCase", () => {
    expect(pascalCase("dot.case.text") === "DotCaseText").toEqual(true);
    expect(pascalCase(".dot.case.text.") === "DotCaseText").toEqual(true);
  });

  it("should convert space case to PascalCase", () => {
    expect(pascalCase("space case text") === "SpaceCaseText").toEqual(true);
    expect(pascalCase("  space  case  text  ") === "SpaceCaseText").toEqual(
      true
    );
  });
});
