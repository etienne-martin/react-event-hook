import { useEffect } from "react";
import EventEmitter from "eventemitter3";
import { useStorageListener } from "./hooks/storage.hook";
import { deserializeEvent, serializeEvent } from "./helpers/event-serializer";
import { LOCAL_STORAGE_KEY } from "./react-event-hook.constant";
import { normalizeEventName } from "./helpers/event-name";

import type {
  CreatedEvent,
  Emitter,
  Listener,
  Options,
} from "./react-event-hook.def";

const eventEmitter = new EventEmitter();
const createdEvents = new Set<string>();

export const createEvent = <EventName extends string>(name: EventName) => {
  return <Payload = void>({ crossTab = false }: Options = {}): CreatedEvent<
    EventName,
    Payload
  > => {
    const normalizedEventName = normalizeEventName(name);
    const listenerName = `use${normalizedEventName}Listener`;
    const emitterName = `emit${normalizedEventName}`;

    if (createdEvents.has(normalizedEventName)) {
      throw new Error(
        `Events can only be created once. Another event named "${normalizedEventName}" already exists.`
      );
    }

    createdEvents.add(normalizedEventName);

    const useListener: Listener<any> = (handler: any) => {
      useStorageListener((storageEvent) => {
        if (!crossTab) return;
        if (!storageEvent.newValue) return;
        if (storageEvent.key !== LOCAL_STORAGE_KEY) return;

        const event = deserializeEvent(storageEvent.newValue);

        if (event.name !== normalizedEventName) return;

        handler(event.payload);
      });

      useEffect(() => {
        eventEmitter.addListener(normalizedEventName, handler);

        return () => {
          eventEmitter.removeListener(normalizedEventName, handler);
        };
      }, [handler]);
    };

    const emitter: Emitter<any> = (event) => {
      eventEmitter.emit(normalizedEventName, event);

      if (crossTab) {
        try {
          window.localStorage.setItem(
            LOCAL_STORAGE_KEY,
            serializeEvent(normalizedEventName, event)
          );
        } catch {
          /**
           * localStorage doesn't work in private mode prior to Safari 11.
           * Cross-tab events are simply dropped if an error is encountered.
           */
        }
      }
    };

    return {
      [listenerName]: useListener,
      [emitterName]: emitter,
    };
  };
};
