import { generateRandomNumber } from "../utils/random-number";

interface DeserializedEvent {
  name: string;
  payload: any;
}

export const serializeEvent = (name: string, payload: any) => {
  return JSON.stringify({
    id: `${Date.now()}:${generateRandomNumber()}`,
    name,
    payload,
  });
};

export const deserializeEvent = (event: string): DeserializedEvent => {
  const { name, payload } = JSON.parse(event);

  return { name, payload };
};
