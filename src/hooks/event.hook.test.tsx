import React, { FC, useState } from "react";
import { render } from "@testing-library/react";
import { useEvent } from "./event.hook";

describe("useEvent", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockRestore();
  });

  it("should always return the same ref between renders", () => {
    const handlerRefs: (() => any)[] = [];

    const Component: FC = () => {
      const eventHandler = useEvent(jest.fn());
      handlerRefs.push(eventHandler);
      return null;
    };

    render(<Component />).rerender(<Component />);
    expect(handlerRefs[0]).toBe(handlerRefs[1]);
  });

  it("should give handlers access to the latest state", () => {
    const countSpy = jest.fn();

    const Component = () => {
      const [count, setCount] = useState(0);
      const getCount = useEvent(() => countSpy(count));
      const incrementCount = () => setCount(count + 1);

      return (
        <>
          <button
            data-testid="increment-count-button"
            onClick={incrementCount}
          />
          <button data-testid="get-count-button" onClick={getCount} />
        </>
      );
    };

    const { getByTestId } = render(<Component />);

    const incrementCountButton = getByTestId("increment-count-button");
    const getCountButton = getByTestId("get-count-button");

    incrementCountButton.click();
    incrementCountButton.click();
    getCountButton.click();

    expect(countSpy).toBeCalledWith(2);
  });

  it("should throw an error if the handler gets called during the first render", () => {
    jest.spyOn(console, "error").mockImplementation();

    const Component: FC = () => {
      useEvent(jest.fn())();
      return null;
    };

    expect(() => render(<Component />)).toThrowError(
      "Cannot call an event handler during the first render."
    );
  });
});
