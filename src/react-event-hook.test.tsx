import React, { FC, useState } from "react";
import { render } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { serializeEvent } from "./helpers/event-serializer";
import { LOCAL_STORAGE_KEY } from "./react-event-hook.constant";
import { normalizeEventName } from "./helpers/event-name";
import { deserialize } from "./utils/serializer";

const eventHandler = jest.fn();

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
    storageSetItemSpy.mockClear();
    jest.resetModules();
  });

  it("should derive the event's properties from the event name", async () => {
    const { createEvent } = await import("./react-event-hook");
    const { useKebabCaseEventNameListener, emitKebabCaseEventName } =
      createEvent("kebab-case-event-name")();

    expect(useKebabCaseEventNameListener).toEqual(expect.any(Function));
    expect(emitKebabCaseEventName).toEqual(expect.any(Function));
  });

  it("should throw an error when recreating an existing event", async () => {
    const { createEvent } = await import("./react-event-hook");

    createEvent("existing-event")();

    expect(() => createEvent("existing-event")()).toThrow(
      new Error(
        `Events can only be created once. Another event named "ExistingEvent" already exists.`
      )
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

      const [call] = storageSetItemSpy.mock.calls;
      const [firstArg, secondArg] = call ?? [];

      expect(firstArg).toEqual(LOCAL_STORAGE_KEY);
      expect(deserialize((secondArg ?? "") as string)).toEqual({
        id: expect.any(String),
        name: "Message",
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
        newValue: serializeEvent(normalizeEventName("message"), "hello"),
      });

      expect(eventHandler).toBeCalledWith("hello");
    });

    it("should throw an error when emitting unserializable cross-tab payloads", async () => {
      const { createEvent } = await import("./react-event-hook");

      const { emitComplexPayload } = createEvent("complex-payload")<Date>({
        crossTab: true,
      });

      expect(() => emitComplexPayload(new Date())).toThrowError(
        `Could not emit "ComplexPayload" event. The event payload might contain values that cannot be serialized.`
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
        newValue: serializeEvent(normalizeEventName("ping"), undefined),
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
        newValue: serializeEvent(normalizeEventName("pong"), undefined),
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

  describe("typescript", () => {
    it("should support union types as payloads", async () => {
      const { createEvent } = await import("./react-event-hook");
      const { emitPingPong } = createEvent("pingPong")<"ping" | "pong">();

      emitPingPong("ping");
      emitPingPong("pong");
    });

    it("should support event handlers with optional parameters", async () => {
      const { createEvent } = await import("./react-event-hook");
      const { usePingListener } = createEvent("ping")();

      const eventHandler = (optionalParam = "defaultParam") => {
        return optionalParam;
      };

      renderHook(() => usePingListener(eventHandler));
    });
  });
});
