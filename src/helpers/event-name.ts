import { pascalCase } from "../utils/pascal-case";
import type { NormalizedEventName } from "./event-name.def";

export const normalizeEventName = <EventName extends string>(
  eventName: EventName
) => {
  return pascalCase(eventName.trim()) as NormalizedEventName<EventName>;
};
