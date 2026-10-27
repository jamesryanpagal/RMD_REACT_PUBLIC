import { useEffect, useRef } from "react";

export const useUpdateEffect = (cb: () => void, deps: any[]) => {
  const startEffect = useRef<boolean>(false);

  useEffect(() => {
    if (startEffect.current) {
      cb();
    }

    startEffect.current = true;
  }, [...deps]);
};
