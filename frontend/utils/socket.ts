"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const useSocket = (token: string | null) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    socket = io("http://localhost:5000", {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => console.log("Socket connected"));
    socket.on("connect_error", (err) => console.error("Socket error:", err.message));

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [token]);

  return socketRef.current;
};

export const getSocket = () => socket;
