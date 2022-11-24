import React, { FC, useEffect, useState } from "react";
import { render } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { expectType } from "tsd";
import { serializeEvent } from "./helpers/event-serializer";
import { LOCAL_STORAGE_KEY } from "./react-event-hook.constant";
import { deserialize } from "./utils/serializer";
import { EventEmitterMock } from "./tests/mocks/eventemitter3.mock";

const eventHandler = jest.fn();
const consoleWarnMock = jest.spyOn(console, "warn").mockImplementation();
const originalAddListener = EventEmitterMock.addListener;
const originalAddEventListener = window.addEventListener;

const storageSetItemSpy = jest.spyOn(
  Object.getPrototypeOf(window.localStorage),
  "setItem"
);

const dispatchStorageEvent = (event: StorageEventInit) => {
  window.dispatchEvent(new StorageEvent("storage", event));
};

describe("react-event-hook", () => {
  beforeEach(() => {
    eventHandler.mockClear();
    consoleWarnMock.mockClear();
    storageSetItemSpy.mockClear();
    jest.resetModules();
    EventEmitterMock.addListener = originalAddListener;
    window.addEventListener = originalAddEventListener;
  });

  it("should derive the event's properties from the event name", async () => {
    const { createEvent } = await import("./react-event-hook");

    const { useKebabCaseEventNameListener, emitKebabCaseEventName } =
      createEvent("kebab-case-event-name")();

    expect(useKebabCaseEventNameListener).toEqual(expect.any(Function));
    expect(emitKebabCaseEventName).toEqual(expect.any(Function));
  });

  it("should log a warning when duplicate events are detected", async () => {
    const { createEvent } = await import("./react-event-hook");
    const { emitEvent } = createEvent("event")();
    const { emitEvent: emitDuplicateEvent } = createEvent("event")();

    emitEvent();
    emitDuplicateEvent();
    emitDuplicateEvent();

    expect(consoleWarnMock).toBeCalledTimes(1);
    expect(consoleWarnMock).toBeCalledWith(
      `Another event named "event" already exists. Duplicate events share the same listener. This can lead to unexpected issues if their payload differs. Make sure to call the \`createEvent\` function only once per event and reuse the resulting functions throughout your application.`
    );
  });

  it("should emit and receive events", async () => {
    const { createEvent } = await import("./react-event-hook");
    const { useIncrementListener, emitIncrement } = createEvent("increment")();

    const ListenerComponent: FC = () => {
      const [count, setCount] = useState(0);

      useIncrementListener(() => {
        setCount(count + 1);
      });

      return <div data-testid="count">{count}</div>;
    };

    const { getByTestId } = render(
      <>
        <ListenerComponent />
        <button
          data-testid="emit-increment-button"
          onClick={() => emitIncrement()}
        />
      </>
    );

    const emitIncrementButton = getByTestId("emit-increment-button");
    const count = getByTestId("count");

    emitIncrementButton.click();
    emitIncrementButton.click();

    expect(count.innerHTML).toEqual("2");
  });

  it("should bind listeners before child components have a chance to emit", async () => {
    const { createEvent } = await import("./react-event-hook");
    const { useIncrementListener, emitIncrement } = createEvent("increment")();

    const ChildComponent: FC = () => {
      useEffect(() => emitIncrement(), []);
      return null;
    };

    const ParentComponent: FC = () => {
      const [count, setCount] = useState(0);

      useIncrementListener(() => {
        setCount(count + 1);
      });

      return (
        <>
          <div data-testid="count">{count}</div>
          <ChildComponent />
        </>
      );
    };

    const { getByTestId } = render(<ParentComponent />);
    const count = getByTestId("count");

    expect(count.innerHTML).toEqual("1");
  });

  it("should avoid unbinding and rebinding listeners on every render", async () => {
    const { createEvent } = await import("./react-event-hook");
    const { useIncrementListener } = createEvent("increment")();
    const addStorageEventListenerSpy = jest.fn();

    EventEmitterMock.addListener = jest.fn();

    window.addEventListener = (...args: [any, any, any]) => {
      if (args[0] === "storage") {
        addStorageEventListenerSpy();
      }

      originalAddEventListener(...args);
    };

    const ListenerComponent: FC = () => {
      useIncrementListener(() => undefined);
      return null;
    };

    const { rerender } = render(<ListenerComponent />);

    rerender(<ListenerComponent />);
    rerender(<ListenerComponent />);

    expect(EventEmitterMock.addListener).toBeCalledTimes(1);
    expect(addStorageEventListenerSpy).toBeCalledTimes(1);
  });

  it("should emit and receive simple payloads", async () => {
    const { createEvent } = await import("./react-event-hook");

    const { useMessageListener, emitMessage } =
      createEvent("message")<string>();

    renderHook(() => useMessageListener(eventHandler));
    emitMessage("hello");

    expect(eventHandler).toBeCalledWith("hello");
  });

  it("should emit and receive complex payloads", async () => {
    const { createEvent } = await import("./react-event-hook");

    const { useComplexPayloadListener, emitComplexPayload } =
      createEvent("complex-payload")<Date>();

    const complexPayload = new Date();

    renderHook(() => useComplexPayloadListener(eventHandler));
    emitComplexPayload(complexPayload);

    expect(eventHandler).toBeCalledWith(complexPayload);
  });

  it("should stop listening for events once unmounted", async () => {
    const { createEvent } = await import("./react-event-hook");
    const { usePingListener, emitPing } = createEvent("ping")();

    renderHook(() => usePingListener(eventHandler)).unmount();

    emitPing();
    expect(eventHandler).not.toBeCalled();
  });

  describe("cross-tab events", () => {
    it("should emit cross-tab events", async () => {
      const { createEvent } = await import("./react-event-hook");

      const { emitMessage } = createEvent("message")<string>({
        crossTab: true,
      });

      emitMessage("hello");

      const [key, value = ""] = storageSetItemSpy.mock.calls[0] ?? [];

      expect(key).toEqual(LOCAL_STORAGE_KEY);
      expect(deserialize(value as string)).toEqual({
        id: expect.any(String),
        name: "message",
        payload: "hello",
      });
    });

    it("should receive cross-tab events", async () => {
      const { createEvent } = await import("./react-event-hook");

      const { useMessageListener } = createEvent("message")<string>({
        crossTab: true,
      });

      renderHook(() => useMessageListener(eventHandler));

      dispatchStorageEvent({
        key: LOCAL_STORAGE_KEY,
        newValue: serializeEvent("message", "hello"),
      });

      expect(eventHandler).toBeCalledWith("hello");
    });

    it("should throw an error when emitting unserializable cross-tab payloads", async () => {
      const { createEvent } = await import("./react-event-hook");

      const { emitComplexPayload } = createEvent("complex-payload")<Date>({
        crossTab: true,
      });

      expect(() => emitComplexPayload(new Date())).toThrowError(
        `Could not emit "complex-payload" event. The event payload might contain values that cannot be serialized.`
      );
    });

    it("should ignore cross-tab events when the crossTab option is disabled", async () => {
      const { createEvent } = await import("./react-event-hook");

      const { usePingListener } = createEvent("ping")({
        crossTab: false,
      });

      renderHook(() => usePingListener(eventHandler));

      dispatchStorageEvent({
        key: LOCAL_STORAGE_KEY,
        newValue: serializeEvent("ping", undefined),
      });

      expect(eventHandler).not.toBeCalled();
    });

    it("should ignore storage deletion events", async () => {
      const { createEvent } = await import("./react-event-hook");

      const { usePingListener } = createEvent("ping")({
        crossTab: true,
      });

      renderHook(() => usePingListener(eventHandler));

      dispatchStorageEvent({
        key: LOCAL_STORAGE_KEY,
        newValue: null,
      });

      expect(eventHandler).not.toBeCalled();
    });

    it("should ignore unrelated react-event-hook events", async () => {
      const { createEvent } = await import("./react-event-hook");

      const { usePingListener } = createEvent("ping")({
        crossTab: true,
      });

      renderHook(() => usePingListener(eventHandler));

      dispatchStorageEvent({
        key: LOCAL_STORAGE_KEY,
        newValue: serializeEvent("pong", undefined),
      });

      expect(eventHandler).not.toBeCalled();
    });

    it("should ignore unrelated storage events", async () => {
      const { createEvent } = await import("./react-event-hook");

      const { usePingListener } = createEvent("ping")({
        crossTab: true,
      });

      renderHook(() => usePingListener(eventHandler));

      dispatchStorageEvent({
        key: "unrelated-storage-key",
        newValue: "unrelated-value",
      });

      expect(eventHandler).not.toBeCalled();
    });
  });

  describe("broadcast", () => {
    it("should not send the event to the sender", async () => {
      const { createEvent } = await import("./react-event-hook");

      const { useMessageListener, emitMessage } = createEvent(
        "message"
      )<string>({
        crossTab: true,
      });

      renderHook(() => useMessageListener(eventHandler));
      emitMessage.broadcast("hello");
      expect(eventHandler).not.toBeCalledWith("hello");
    });
  });

  describe("typescript", () => {
    it("should support payloads with union types", async () => {
      const { createEvent } = await import("./react-event-hook");

      const { usePingPongListener, emitPingPong } = createEvent("pingPong")<
        "ping" | "pong"
      >();

      expectType<(handler: (payload: "ping" | "pong") => void) => void>(
        usePingPongListener
      );

      expectType<(payload: "ping" | "pong") => void>(emitPingPong);
    });

    it("should support event handlers with optional parameters", async () => {
      const { createEvent } = await import("./react-event-hook");
      const { usePingListener } = createEvent("ping")();

      expectType<(handler: (payload?: "string") => void) => void>(
        usePingListener
      );
    });
  });
});
