import { useEffect } from "react";
import EventEmitter from "eventemitter3";
import { capitalize } from "./utils/capitalize";
import { useStorageListener } from "./hooks/storage.hook";
import { deserializeEvent, serializeEvent } from "./helpers/event-serializer";
import { getStorageKey } from "./helpers/storage-key";

export interface Options {
  crossTab?: boolean;
}

export type Listener<Event> = Event extends undefined
  ? (handler: () => void) => void
  : (handler: (event: Event) => void) => void;

export type Emitter<Event> = Event extends undefined
  ? () => void
  : (event: Event) => void;

interface Base<Event> {
  listener: {
    prefix: "use";
    suffix: "Listener";
    fn: Listener<Event>;
  };
  emitter: {
    prefix: "emit";
    suffix: "";
    fn: Emitter<Event>;
  };
}

type CreatedEvent<Event, EventName extends string> = {
  [Property in keyof Base<Event> as `${Base<Event>[Property]["prefix"]}${Capitalize<EventName>}${Base<Event>[Property]["suffix"]}`]: Base<Event>[Property]["fn"];
};

const eventEmitter = new EventEmitter();

export const createEvent = <EventName extends string>(name: EventName) => {
  return <Event = undefined>({ crossTab = false }: Options = {}): CreatedEvent<
    Event,
    EventName
  > => {
    const listenerName = `use${capitalize(name)}Listener`;
    const emitterName = `emit${capitalize(name)}`;
    const storageKey = getStorageKey(name);

    const useListener: Listener<any> = (handler: any) => {
      useStorageListener((event) => {
        if (!crossTab) return;
        if (event.key !== storageKey) return;
        if (!event.newValue) return;

        handler(deserializeEvent(event.newValue));
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
          window.localStorage.setItem(storageKey, serializeEvent(event));
        } catch (err) {
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
