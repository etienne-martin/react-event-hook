import { useEffect } from "react";
import EventEmitter from "eventemitter3";
import { capitalize } from "./utils/capitalize";
import { useStorageListener } from "./hooks/storage.hook";
import { deserializeEvent, serializeEvent } from "./helpers/event-serializer";
import { LOCAL_STORAGE_KEY } from "./react-event-hook.constant";

export interface Options {
  crossTab?: boolean;
}

export type Listener<Payload> = (handler: (payload: Payload) => void) => void;
export type Emitter<Payload> = (payload: Payload) => void;

interface Base<Payload> {
  listener: {
    prefix: "use";
    suffix: "Listener";
    fn: Listener<Payload>;
  };
  emitter: {
    prefix: "emit";
    suffix: "";
    fn: Emitter<Payload>;
  };
}

type CreatedEvent<EventName extends string, Payload> = {
  [Property in keyof Base<Payload> as `${Base<Payload>[Property]["prefix"]}${Capitalize<EventName>}${Base<Payload>[Property]["suffix"]}`]: Base<Payload>[Property]["fn"];
};

const eventEmitter = new EventEmitter();

export const createEvent = <EventName extends string>(name: EventName) => {
  return <Payload = void>({ crossTab = false }: Options = {}): CreatedEvent<
    EventName,
    Payload
  > => {
    const listenerName = `use${capitalize(name)}Listener`;
    const emitterName = `emit${capitalize(name)}`;

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
