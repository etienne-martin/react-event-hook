import { capitalize } from "./capitalize";
import { Delimiters, PascalCase } from "./pascal-case.def";

const delimiters: Delimiters = ["-", "_", " "];

const isAllCaps = (str: string) => {
  return str.trim() && str.toUpperCase() === str;
};

const lowercaseCapitalize = (str: string) => {
  return capitalize(str.toLowerCase());
};

export const pascalCase = <Str extends string>(str: Str): PascalCase<Str> => {
  const [before, after] = str.split(new RegExp(`[${delimiters.join("")}](.*)`));

  if (before !== undefined && after !== undefined) {
    return `${lowercaseCapitalize(before)}${pascalCase(
      lowercaseCapitalize(after)
    )}` as PascalCase<Str>;
  }

  if (isAllCaps(str)) {
    return lowercaseCapitalize(str) as PascalCase<Str>;
  }

  return capitalize(str) as PascalCase<Str>;
};
