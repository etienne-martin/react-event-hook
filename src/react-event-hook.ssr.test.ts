/**
 * @jest-environment node
 */

import { EventEmitterMock } from "./tests/mocks/eventemitter3.mock";

const consoleWarnMock = jest.spyOn(console, "warn").mockImplementation();

describe("react-event-hook (SSR)", () => {
  beforeEach(() => {
    consoleWarnMock.mockClear();
    jest.resetModules();
  });

  it("should not emit events from the server", async () => {
    const { createEvent } = await import("./react-event-hook");
    const { emitEvent } = createEvent("event")();

    EventEmitterMock.emit = jest.fn();
    emitEvent();
    expect(EventEmitterMock.emit).not.toBeCalled();
  });

  it("should log a warning when emitting events from the server", async () => {
    const { createEvent } = await import("./react-event-hook");
    const { emitEvent } = createEvent("event")();

    emitEvent();

    expect(consoleWarnMock).toBeCalledWith(
      `Could not emit "event" event. Events cannot be emitted from the server.`
    );
  });
});
