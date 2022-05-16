import { deserialize, serialize } from "../utils/serializer";
import { generateRandomId } from "../utils/random-id";

interface DeserializedEvent {
  name: string;
  payload: any;
}

export const serializeEvent = (name: string, payload: unknown) => {
  return serialize({
    id: generateRandomId(),
    name,
    payload,
  });
};

export const deserializeEvent = (event: string): DeserializedEvent => {
  const { name, payload } = deserialize(event);

  return { name, payload };
};
