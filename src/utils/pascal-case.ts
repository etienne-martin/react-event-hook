import { capitalize } from "./capitalize";
import { ToPascaleCase } from "./pascal-case.def";

const isAllCaps = (str: string) => {
  return str.trim() && str.toUpperCase() === str;
};

export const toPascalCase = <S extends string>(str: S) => {
  return str
    .split(/[-_]/)
    .map((token) =>
      token
        .split(/([A-Z]+)/)
        .map((token, index, tokens) => {
          const prevToken = tokens[index - 1];

          if (prevToken && isAllCaps(prevToken)) {
            return token;
          }

          return capitalize(token.toLowerCase());
        })
        .join("")
    )
    .join("") as ToPascaleCase<S>;
};
