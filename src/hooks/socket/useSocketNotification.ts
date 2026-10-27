import { useEffect, useRef } from "react";
import { getSocket, SOCKET_EVENTS } from "@/utils/socket";

export function useSocketNotification<T = unknown>(
  onNotification: (payload: T) => void,
) {
  const callbackRef = useRef(onNotification);
  callbackRef.current = onNotification;

  useEffect(() => {
    const socket = getSocket();

    const handler = (payload: T) => {
      callbackRef.current(payload);
    };

    socket.on(SOCKET_EVENTS.NOTIFICATION, handler);
    return () => {
      socket.off(SOCKET_EVENTS.NOTIFICATION, handler);
    };
  }, []);
}
