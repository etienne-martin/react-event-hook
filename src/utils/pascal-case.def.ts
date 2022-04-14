// TODO: add support for CONSTANT_CASE conversion
export type ToPascaleCase<
  S extends string,
  D extends string = "-" | "_"
> = string extends S
  ? string
  : S extends ""
  ? ""
  : S extends `${infer T}${D}${infer U}`
  ? `${Capitalize<T>}${ToPascaleCase<U, D>}`
  : Capitalize<S>;
