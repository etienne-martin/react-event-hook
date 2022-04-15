import { generateRandomNumber } from "../utils/random-number";
import { deserialize, serialize } from "../utils/serializer";

interface DeserializedEvent {
  name: string;
  payload: any;
}

export const serializeEvent = (name: string, payload: unknown) => {
  return serialize({
    id: `${Date.now()}:${generateRandomNumber()}`,
    name,
    payload,
  });
};

export const deserializeEvent = (event: string): DeserializedEvent => {
  const { name, payload } = deserialize(event);

  return { name, payload };
};
