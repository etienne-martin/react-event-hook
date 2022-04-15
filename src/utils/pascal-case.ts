import { capitalize } from "./capitalize";
import type { Delimiters, PascalCase } from "./pascal-case.def";

const delimiters: Delimiters = ["-", "_", ":", "/", ".", " "];

const isAllCaps = (str: string) => {
  return str.toUpperCase() === str && str.toLowerCase() !== str;
};

const lowercaseCapitalize = (str: string) => {
  return capitalize(str.toLowerCase());
};

export const pascalCase = <Str extends string>(str: Str): PascalCase<Str> => {
  const [token, rest] = str.split(new RegExp(`[${delimiters.join("")}](.*)`));

  if (token !== undefined && rest !== undefined) {
    return `${lowercaseCapitalize(token)}${pascalCase(
      rest
    )}` as PascalCase<Str>;
  }

  if (isAllCaps(str)) {
    return lowercaseCapitalize(str) as PascalCase<Str>;
  }

  return capitalize(str) as PascalCase<Str>;
};
