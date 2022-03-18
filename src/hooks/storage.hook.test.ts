import { renderHook } from "@testing-library/react-hooks";
import { useStorageListener } from "./storage.hook";

const eventHandler = jest.fn();

const dispatchStorageEvent = () => {
  window.dispatchEvent(
    new StorageEvent("storage", {
      key: "storage-key",
      newValue: "new-value",
    })
  );
};

describe("useStorageListener", () => {
  beforeEach(() => {
    eventHandler.mockClear();
  });

  it("should listen for storage events", () => {
    renderHook(() => useStorageListener(eventHandler));
    dispatchStorageEvent();
    expect(eventHandler).toBeCalled();
  });

  it("should stop receiving events once unmounted", () => {
    renderHook(() => useStorageListener(eventHandler)).unmount();
    dispatchStorageEvent();
    expect(eventHandler).not.toBeCalled();
  });
});
