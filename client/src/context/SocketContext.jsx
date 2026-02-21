import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    let newSocket;

    if (isAuthenticated && user?.tenant_id) {
      const apiUrl = import.meta.env.VITE_API_URL;
      const serverUrl = apiUrl.replace("/api/v1", "");

      const token = localStorage.getItem("token");

      newSocket = io(serverUrl, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: true,
        auth: { token },
      });

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
      });

      // Global listeners
      newSocket.on("order:new", (order) => {
        toast.success(`New Order #${order.id.slice(0, 8)} received!`);
        queryClient.invalidateQueries(["orders"]);
        queryClient.invalidateQueries(["dashboardStats"]);
      });

      newSocket.on("order:update", (order) => {
        // toast("Order updated: " + order.status);
        queryClient.invalidateQueries(["orders"]);
        queryClient.invalidateQueries(["order", order.id]);
      });

      newSocket.on("inventory:update", () => {
        console.log("Inventory update received");
        queryClient.invalidateQueries(["inventory"]);
      });

      newSocket.on("table:update", () => {
        queryClient.invalidateQueries(["tables"]);
      });

      setSocket(newSocket);
    }

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [isAuthenticated, user, queryClient]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
