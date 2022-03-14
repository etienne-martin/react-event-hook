import { useEffect } from "react";
import EventEmitter from "eventemitter3";

const eventEmitter = new EventEmitter();

export const useListener = (
  event: string,
  handler: (...args: any[]) => void
) => {
  useEffect(() => {
    eventEmitter.addListener(event, handler);

    return () => {
      eventEmitter.removeListener(event, handler);
    };
  }, [event, handler]);
};

export const useEmitter = (): typeof eventEmitter.emit => {
  return (event, ...args) => {
    return eventEmitter.emit(event, ...args);
  };
};
