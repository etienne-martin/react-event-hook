import { useEvent } from "./event.hook";
import { useIsomorphicLayoutEffect } from "./layout-effect.hook";

export const useStorageListener = (handler: (event: StorageEvent) => void) => {
  const eventHandler = useEvent(handler);

  useIsomorphicLayoutEffect(() => {
    window.addEventListener("storage", eventHandler);

    return () => {
      window.removeEventListener("storage", eventHandler);
    };
  }, [eventHandler]);
};
