import { Server, Socket } from "socket.io";

export const initSocket = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: { origin: "http://localhost:5173" } // Your Frontend URL
  });

  io.on("connection", (socket: Socket) => {
    // 1. Join a specific order room
    socket.on("join_order", (orderId: string) => {
      socket.join(orderId);
    });

    // 2. Listen for driver movement
    socket.on("update_location", (data: { orderId: string; lat: number; lng: number }) => {
      // Send location ONLY to the customer in this order room
      io.to(data.orderId).emit("driver_moved", { lat: data.lat, lng: data.lng });
    });
  });
};
