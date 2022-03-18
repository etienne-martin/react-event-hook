import { useEffect } from "react";

export const useStorageListener = (handler: (event: StorageEvent) => void) => {
  useEffect(() => {
    window.addEventListener("storage", handler);

    return () => {
      window.removeEventListener("storage", handler);
    };
  }, [handler]);
};
