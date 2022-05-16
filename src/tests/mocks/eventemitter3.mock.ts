import EventEmitter from "eventemitter3";

export const EventEmitterMock = new EventEmitter();

jest.doMock("eventemitter3", () => () => EventEmitterMock);
