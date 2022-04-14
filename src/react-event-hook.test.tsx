import React, { FC, useState } from "react";
import { render } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { serializeEvent } from "./helpers/event-serializer";
import { LOCAL_STORAGE_KEY } from "./react-event-hook.constant";

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

  it("should log a warning when creating an event that already exists", async () => {
    const { createEvent } = await import("./react-event-hook");

    createEvent("duplicate-event")();

    expect(() => createEvent("duplicate-event")<string>()).toThrow(
      new Error(`An event named "duplicate-event" already exists.`)
    );
  });

  it("should emit and receive event with payload", async () => {
    const { createEvent } = await import("./react-event-hook");

    const { useMessageListener, emitMessage } =
      createEvent("message")<string>();

    renderHook(() => useMessageListener(eventHandler));
    emitMessage("hello");

    expect(eventHandler).toBeCalledWith("hello");
  });

  it("should stop listening for events once unmounted", async () => {
    const { createEvent } = await import("./react-event-hook");
    const { usePingListener, emitPing } = createEvent("ping")();

    renderHook(() => usePingListener(eventHandler)).unmount();

    emitPing();
    expect(eventHandler).not.toBeCalled();
  });

  describe("event name derivation", () => {
    it("should properly derive the event's properties from a camelCase event name", async () => {
      const { createEvent } = await import("./react-event-hook");
      const { useCamelCaseEventListener, emitCamelCaseEvent } =
        createEvent("camelCaseEvent")();

      expect(useCamelCaseEventListener).toEqual(expect.any(Function));
      expect(emitCamelCaseEvent).toEqual(expect.any(Function));
    });

    it("should properly derive the event's properties from a PascalCase event name", async () => {
      const { createEvent } = await import("./react-event-hook");
      const { usePascalCaseEventListener, emitPascalCaseEvent } =
        createEvent("PascalCaseEvent")();

      expect(usePascalCaseEventListener).toEqual(expect.any(Function));
      expect(emitPascalCaseEvent).toEqual(expect.any(Function));
    });

    it("should properly derive the event's properties from a kebab-case event name", async () => {
      const { createEvent } = await import("./react-event-hook");
      const { useKebabCaseEventListener, emitKebabCaseEvent } =
        createEvent("kebab-case-event")();

      expect(useKebabCaseEventListener).toEqual(expect.any(Function));
      expect(emitKebabCaseEvent).toEqual(expect.any(Function));
    });

    it("should properly derive the event's properties from a snake_case event name", async () => {
      const { createEvent } = await import("./react-event-hook");
      const { useSnakeCaseEventListener, emitSnakeCaseEvent } =
        createEvent("snake_case_event")();

      expect(useSnakeCaseEventListener).toEqual(expect.any(Function));
      expect(emitSnakeCaseEvent).toEqual(expect.any(Function));
    });

    // TODO: add support for CONSTANT_CASE
    it.skip("should properly derive the event's properties from a CONSTANT_CASE event name", async () => {
      const { createEvent } = await import("./react-event-hook");
      const { useCONSTANTCASEEVENTListener, emitCONSTANTCASEEVENT } =
        createEvent("CONSTANT_CASE_EVENT")();

      expect(useCONSTANTCASEEVENTListener).toEqual(expect.any(Function));
      expect(emitCONSTANTCASEEVENT).toEqual(expect.any(Function));
    });
  });

  describe("cross-tab events", () => {
    it("should emit cross-tab events", async () => {
      const { createEvent } = await import("./react-event-hook");

      const { emitPing } = createEvent("ping")({
        crossTab: true,
      });

      emitPing();

      expect(storageSetItemSpy).toBeCalledWith(
        LOCAL_STORAGE_KEY,
        expect.any(String)
      );
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

    it("should ignore cross-tab events when the crossTab option is not enabled", async () => {
      const { createEvent } = await import("./react-event-hook");
      const { usePingListener } = createEvent("ping")();

      renderHook(() => usePingListener(eventHandler));

      dispatchStorageEvent({
        key: LOCAL_STORAGE_KEY,
        newValue: serializeEvent("ping", "hello"),
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
});
