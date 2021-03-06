// Inspired by: https://www.typescriptlang.org/play?ts=4.1.0-dev.20201028#example/string-manipulation-with-template-literals

export type Delimiters = ["-", "_", ":", "/", ".", " "];

type Delimiter = Delimiters[number];

type LowercaseCapitalize<S extends string> = Capitalize<Lowercase<S>>;

export type PascalCase<Str extends string> =
  Str extends `${infer Token}${Delimiter}${infer Rest}`
    ? `${LowercaseCapitalize<Token>}${PascalCase<Rest>}`
    : Str extends Uppercase<Str>
    ? LowercaseCapitalize<Str>
    : Capitalize<Str>;
