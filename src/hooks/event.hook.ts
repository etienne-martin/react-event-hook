import { useCallback, useRef } from "react";
import { useIsomorphicLayoutEffect } from "./layout-effect.hook";

type AnyFunction = (...args: any[]) => any;

export const useEvent = <T extends AnyFunction>(handler?: T) => {
  const handlerRef = useRef<AnyFunction | undefined>(() => {
    throw new Error("Cannot call an event handler during the first render.");
  });

  useIsomorphicLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback<AnyFunction>(
    (...args) => handlerRef.current?.apply(null, args),
    []
  ) as T;
};
