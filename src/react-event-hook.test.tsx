import React, { FC, useState } from "react";
import { render } from "@testing-library/react";
import { createEvent } from "./react-event-hook";
import { renderHook } from "@testing-library/react-hooks";
import { serializeEvent } from "./helpers/event-serializer";
import { getStorageKey } from "./helpers/storage-key";

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
  });

  it("should emit and receive events", () => {
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

  it("should emit and receive event with payload", () => {
    const { useMessageListener, emitMessage } =
      createEvent("message")<string>();

    renderHook(() => useMessageListener(eventHandler));
    emitMessage("hello");

    expect(eventHandler).toBeCalledWith("hello");
  });

  it("should stop receiving events once unmounted", () => {
    const { usePingListener, emitPing } = createEvent("ping")();

    renderHook(() => usePingListener(eventHandler)).unmount();

    emitPing();
    expect(eventHandler).not.toBeCalled();
  });

  describe("cross-tab events", () => {
    it("should emit cross-tab events", () => {
      const { emitPing } = createEvent("ping")({
        crossTab: true,
      });

      emitPing();

      expect(storageSetItemSpy).toBeCalledWith(
        getStorageKey("ping"),
        expect.any(String)
      );
    });

    it("should receive cross-tab events", () => {
      const { useMessageListener } = createEvent("message")<string>({
        crossTab: true,
      });

      renderHook(() => useMessageListener(eventHandler));

      dispatchStorageEvent({
        key: getStorageKey("message"),
        newValue: serializeEvent("hello"),
      });

      expect(eventHandler).toBeCalledWith("hello");
    });

    it("should ignore cross-tab events when the crossTab options is set to false", () => {
      const { usePingListener } = createEvent("ping")();

      renderHook(() => usePingListener(eventHandler));

      dispatchStorageEvent({
        key: getStorageKey("ping"),
        newValue: serializeEvent("hello"),
      });

      expect(eventHandler).not.toBeCalled();
    });

    it("should ignore storage deletion events", () => {
      const { usePingListener } = createEvent("ping")({
        crossTab: true,
      });

      renderHook(() => usePingListener(eventHandler));

      dispatchStorageEvent({
        key: getStorageKey("ping"),
        newValue: null,
      });

      expect(eventHandler).not.toBeCalled();
    });

    it("should ignore unrelated storage events", () => {
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
