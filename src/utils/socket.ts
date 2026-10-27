import { io, Socket } from "socket.io-client";
import config from "./config";

export const enum SOCKET_EVENTS {
  NOTIFICATION = "NOTIFICATION",
}

const SOCKET_URL = config.socketUrl;

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: true,
    });
  }
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
