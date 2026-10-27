import { useState, useEffect, useRef } from "react";
import { DEFAULTS } from "../utils/constants";

export const useDeferred = (value?: string, delayTime?: number) => {
  const [val, setVal] = useState<string>();
  const timeOutId = useRef<number | null>(null);

  const cbDebounce = (cb: () => void) => {
    if (timeOutId.current) {
      clearTimeout(timeOutId.current);
    }

    timeOutId.current = setTimeout(() => {
      cb();
    }, delayTime || DEFAULTS.deferredTime);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setVal(value);
    }, delayTime || DEFAULTS.deferredTime);

    return () => clearTimeout(delay);
  }, [delayTime, value]);

  return { val, cbDebounce };
};
