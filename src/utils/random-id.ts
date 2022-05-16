import { generateRandomNumber } from "./random-number";

export const generateRandomId = () => {
  return `${Date.now()}:${generateRandomNumber()}`;
};
