import { getTypeOf } from "./typeof";

const UNDEFINED_PLACEHOLDER = "react-event-hook:undefined";

const SERIALIZATION_ERROR = new Error(
  "The input value could not be serialized"
);

export const serialize = (input: unknown) => {
  try {
    const inputType = getTypeOf(input);

    const serialized = JSON.stringify(input, (key, value) => {
      if (value === undefined) return UNDEFINED_PLACEHOLDER;
      return value;
    });

    const deserialized = deserialize(serialized);
    const outputType = getTypeOf(deserialized);

    if (outputType !== inputType) throw SERIALIZATION_ERROR;

    if (inputType === "object") {
      Object.values(input as Record<string, unknown>).forEach((value) =>
        serialize(value)
      );
    }

    if (inputType === "array") {
      (input as unknown[]).forEach((value) => serialize(value));
    }

    return serialized;
  } catch {
    throw SERIALIZATION_ERROR;
  }
};

export const deserialize = (input: string) => {
  return JSON.parse(input, (key, value) => {
    if (value === UNDEFINED_PLACEHOLDER) return undefined;
    return value;
  });
};
