import type { Trim } from "./utils/trim.def";
import type { PascalCase } from "./utils/pascal-case.def";

export interface Options {
  crossTab?: boolean;
}

export type Listener<Payload> = Payload extends void
  ? (handler: () => void) => void
  : (handler: (payload: Payload) => void) => void;

export type Emitter<Payload> = ((payload: Payload) => void) & {
  broadcast: (payload: Payload) => void;
};

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
> = `${Prefix}${PascalCase<Trim<EventName>>}${Suffix}`;

export type CreatedEvent<EventName extends string, Payload> = {
  [Property in keyof Base<Payload> as FuncName<
    Base<Payload>[Property]["prefix"],
    Base<Payload>[Property]["suffix"],
    EventName
  >]: Base<Payload>[Property]["fn"];
};
