import express, { Request, Response } from "express";
import runpy from "./services/runpy";
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // to parse JSON requests

app.get("/", (req: Request, res: Response) => {
  // runpy();
  res.send("Hello from Express + TypeScript!");
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins — change this in production
  },
});

io.on("connection", (socket) => {
  console.log("🔌 A user connected:", socket.id);

  socket.on("audio-file", (msg: Record<string, any>) => {
    console.log("📨 Message received:", msg);
    const { blob } = msg;
    const buffer = Buffer.from(blob);
    const id = uuidv4();
    const filename = path.join(__dirname, "tmp", `temp_${id}.wav`);

    fs.writeFileSync(filename, buffer);
    runpy(filename, id);
    // io.emit("chat message", msg); // Broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

httpServer.listen(4000, () => {
  console.log("✅ WS Server running on http://localhost:4000");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
