import { useEffect } from "react";
import EventEmitter from "eventemitter3";
import { useStorageListener } from "./hooks/storage.hook";
import { deserializeEvent, serializeEvent } from "./helpers/event-serializer";
import { LOCAL_STORAGE_KEY } from "./react-event-hook.constant";
import { pascalCase } from "./utils/pascal-case";
import { generateRandomNumber } from "./utils/random-number";

import type {
  CreatedEvent,
  Emitter,
  Listener,
  Options,
} from "./react-event-hook.def";

const eventEmitter = new EventEmitter();
const emittedEvents = new Map<string, string>();

export const createEvent = <EventName extends string>(name: EventName) => {
  return <Payload = void>({ crossTab = false }: Options = {}): CreatedEvent<
    EventName,
    Payload
  > => {
    const normalizedEventName = name.trim();
    const pascalCaseEventName = pascalCase(normalizedEventName);
    const listenerName = `use${pascalCaseEventName}Listener`;
    const emitterName = `emit${pascalCaseEventName}`;
    const eventId = `${Date.now()}:${generateRandomNumber()}`;

    const duplicateEventDetection = () => {
      if (emittedEvents.has(normalizedEventName)) {
        if (emittedEvents.get(normalizedEventName) !== eventId) {
          console.warn(
            `Another event named "${normalizedEventName}" already exists. Duplicate events share the same listener. This can lead to unexpected issues if their payload differs. Make sure to call the \`createEvent\` function only once per event and reuse the resulting functions throughout your application.`
          );
        }
      }

      emittedEvents.set(normalizedEventName, eventId);
    };

    const useListener: Listener<any> = (handler: (payload: any) => void) => {
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

    const emitter: Emitter<Payload> = (payload) => {
      duplicateEventDetection();
      eventEmitter.emit(normalizedEventName, payload);

      if (crossTab) {
        try {
          const serializedEvent = serializeEvent(normalizedEventName, payload);

          try {
            window.localStorage.setItem(LOCAL_STORAGE_KEY, serializedEvent);
          } catch {
            /**
             * localStorage doesn't work in private mode prior to Safari 11.
             * Cross-tab events are simply dropped if an error is encountered.
             */
          }
        } catch {
          throw new Error(
            `Could not emit "${normalizedEventName}" event. The event payload might contain values that cannot be serialized.`
          );
        }
      }
    };

    return {
      [listenerName]: useListener,
      [emitterName]: emitter,
    };
  };
};
