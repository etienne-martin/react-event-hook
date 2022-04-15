import type { NormalizedEventName } from "./helpers/event-name.def";

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

type FuncName<
  Prefix extends string,
  Suffix extends string,
  EventName extends string
> = `${Prefix}${NormalizedEventName<EventName>}${Suffix}`;

export type CreatedEvent<EventName extends string, Payload> = {
  [Property in keyof Base<Payload> as FuncName<
    Base<Payload>[Property]["prefix"],
    Base<Payload>[Property]["suffix"],
    EventName
  >]: Base<Payload>[Property]["fn"];
};
