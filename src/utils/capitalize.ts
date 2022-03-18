export const capitalize = <S extends string>(str: S) => {
  return [str[0]?.toUpperCase(), str.slice(1)].join("") as Capitalize<S>;
};
