import { pascalCase } from "../utils/pascal-case";
import type { NormalizedEventName } from "./event-name.def";

export const normalizeEventName = <Str extends string>(eventName: Str) => {
  return pascalCase(eventName.trim()) as NormalizedEventName<Str>;
};
