type Whitespace = "\n" | " ";

export type Trim<T> = T extends `${Whitespace}${infer U}`
  ? Trim<U>
  : T extends `${infer U}${Whitespace}`
  ? Trim<U>
  : T;
