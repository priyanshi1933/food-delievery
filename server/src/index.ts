import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes/route";
import cors, { CorsOptions } from "cors";
import path from "path"
import http from "http"; // 1. Import http
import { Server } from "socket.io";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.MONGO_URI || "";
const PORT = process.env.PORT || 3001;

mongoose
  .connect(connectionString)
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => console.log(err));

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const corsOptions: CorsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST","PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(express.json());
app.use(cors(corsOptions));
app.use(router);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_order", (orderId) => {
    socket.join(orderId);
    console.log(`User joined room: ${orderId}`);
  });

  socket.on("update_location", (data) => {
    // Broadcast to everyone in the order room
    io.to(data.orderId).emit("driver_moved", { 
      lat: data.lat, 
      lng: data.lng 
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// 6. IMPORTANT: Listen on 'server', NOT 'app'
server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
