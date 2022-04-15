import { getTypeOf } from "./type-of";

const UNDEFINED_PLACEHOLDER = "react-event-hook:undefined";

class SerializationError extends Error {
  message = "The input value could not be serialized";
}

export const serialize = (input: unknown) => {
  try {
    const inputType = getTypeOf(input);

    const serialized = JSON.stringify(input, (key, value) => {
      if (value === undefined) return UNDEFINED_PLACEHOLDER;
      return value;
    });

    const deserialized = deserialize(serialized);
    const outputType = getTypeOf(deserialized);

    if (outputType !== inputType) throw new SerializationError();

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
    throw new SerializationError();
  }
};

export const deserialize = (input: string) => {
  return JSON.parse(input, (key, value) => {
    if (value === UNDEFINED_PLACEHOLDER) return undefined;
    return value;
  });
};
