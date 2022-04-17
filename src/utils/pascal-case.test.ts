import { expectType } from "tsd";
import { pascalCase } from "./pascal-case";

describe("pascalCase", () => {
  it("should convert camelCase to PascalCase", () => {
    expect(pascalCase("camel")).toEqual("Camel");
    expect(pascalCase("camelCaseText")).toEqual("CamelCaseText");
    expectType<"Camel">(pascalCase("camel"));
    expectType<"CamelCaseText">(pascalCase("camelCaseText"));
  });

  it("should convert PascalCase to PascalCase", () => {
    expect(pascalCase("Pascal")).toEqual("Pascal");
    expect(pascalCase("PascalCaseText")).toEqual("PascalCaseText");
    expectType<"Pascal">(pascalCase("Pascal"));
    expectType<"PascalCaseText">(pascalCase("PascalCaseText"));
  });

  it("should convert kebab-case to PascalCase", () => {
    expect(pascalCase("kebab-case-text")).toEqual("KebabCaseText");
    expect(pascalCase("--kebab--case--text--")).toEqual("KebabCaseText");
    expectType<"KebabCaseText">(pascalCase("kebab-case-text"));
    expectType<"KebabCaseText">(pascalCase("--kebab--case--text--"));
  });

  it("should convert snake_case to PascalCase", () => {
    expect(pascalCase("snake_case_text")).toEqual("SnakeCaseText");
    expect(pascalCase("__snake__case__text__")).toEqual("SnakeCaseText");
    expectType<"SnakeCaseText">(pascalCase("snake_case_text"));
    expectType<"SnakeCaseText">(pascalCase("__snake__case__text__"));
  });

  it("should convert CONSTANT_CASE to PascalCase", () => {
    expect(pascalCase("CONSTANT")).toEqual("Constant");
    expect(pascalCase("CONSTANT_CASE_TEXT")).toEqual("ConstantCaseText");
    expect(pascalCase("__CONSTANT__CASE__TEXT__")).toEqual("ConstantCaseText");
    expectType<"Constant">(pascalCase("CONSTANT"));
    expectType<"ConstantCaseText">(pascalCase("CONSTANT_CASE_TEXT"));
    expectType<"ConstantCaseText">(pascalCase("__CONSTANT__CASE__TEXT__"));
  });

  it("should convert colon:case to PascalCase", () => {
    expect(pascalCase("colon:case:text")).toEqual("ColonCaseText");
    expect(pascalCase(":colon:case:text:")).toEqual("ColonCaseText");
    expectType<"ColonCaseText">(pascalCase("colon:case:text"));
    expectType<"ColonCaseText">(pascalCase(":colon:case:text:"));
  });

  it("should convert slash/case to PascalCase", () => {
    expect(pascalCase("slash/case/text")).toEqual("SlashCaseText");
    expect(pascalCase("/slash/case/text/")).toEqual("SlashCaseText");
    expectType<"SlashCaseText">(pascalCase("slash/case/text"));
    expectType<"SlashCaseText">(pascalCase("/slash/case/text/"));
  });

  it("should convert dot.case to PascalCase", () => {
    expect(pascalCase("dot.case.text")).toEqual("DotCaseText");
    expect(pascalCase(".dot.case.text.")).toEqual("DotCaseText");
    expectType<"DotCaseText">(pascalCase("dot.case.text"));
    expectType<"DotCaseText">(pascalCase(".dot.case.text."));
  });

  it("should convert space case to PascalCase", () => {
    expect(pascalCase("space case text")).toEqual("SpaceCaseText");
    expect(pascalCase("  space  case  text  ")).toEqual("SpaceCaseText");
    expectType<"SpaceCaseText">(pascalCase("space case text"));
    expectType<"SpaceCaseText">(pascalCase("  space  case  text  "));
  });
});
