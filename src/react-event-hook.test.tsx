import { EventEmitterMock } from "./mocks/eventemitter3.mock";

import React, { FC, useState } from "react";
import { render } from "@testing-library/react";
import { useListener, useEmitter } from "./react-event-hook";

const ListenerComponent: FC = () => {
  const [count, setCount] = useState(0);

  useListener("my-event", () => {
    setCount(count + 1);
  });

  return <div data-testid="counter">{count}</div>;
};

const EmitterComponent: FC = () => {
  const emit = useEmitter();

  return (
    <button
      data-testid="emit-button"
      onClick={() => emit("my-event", 1, 2, 3)}
    />
  );
};

describe("react-event-hook", () => {
  describe("useListener", () => {
    it("should emit and receive events", () => {
      const { getByTestId } = render(
        <>
          <ListenerComponent />
          <EmitterComponent />
        </>
      );

      const emitButton = getByTestId("emit-button");
      const counter = getByTestId("counter");

      emitButton.click();
      emitButton.click();
      emitButton.click();

      expect(counter.innerHTML).toEqual("3");
    });

    it("should remove listeners when unmounting", () => {
      const getListenerCount = () => EventEmitterMock.listenerCount("my-event");
      const { unmount } = render(<ListenerComponent />);

      expect(getListenerCount()).toEqual(1);
      unmount();
      expect(getListenerCount()).toEqual(0);
    });
  });
});
