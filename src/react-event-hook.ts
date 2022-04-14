import { useEffect } from "react";
import EventEmitter from "eventemitter3";
import { toPascalCase } from "./utils/pascal-case";
import { useStorageListener } from "./hooks/storage.hook";
import { deserializeEvent, serializeEvent } from "./helpers/event-serializer";
import { LOCAL_STORAGE_KEY } from "./react-event-hook.constant";

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
    const listenerName = `use${toPascalCase(name)}Listener`;
    const emitterName = `emit${toPascalCase(name)}`;

    if (createdEvents.has(name)) {
      throw new Error(`An event named "${name}" already exists.`);
    }

    createdEvents.add(name);

    const useListener: Listener<any> = (handler: any) => {
      useStorageListener((storageEvent) => {
        if (!crossTab) return;
        if (!storageEvent.newValue) return;
        if (storageEvent.key !== LOCAL_STORAGE_KEY) return;

        const event = deserializeEvent(storageEvent.newValue);

        if (event.name !== name) return;

        handler(event.payload);
      });

      useEffect(() => {
        eventEmitter.addListener(name, handler);

        return () => {
          eventEmitter.removeListener(name, handler);
        };
      }, [handler]);
    };

    const emitter: Emitter<any> = (event) => {
      eventEmitter.emit(name, event);

      if (crossTab) {
        try {
          window.localStorage.setItem(
            LOCAL_STORAGE_KEY,
            serializeEvent(name, event)
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
