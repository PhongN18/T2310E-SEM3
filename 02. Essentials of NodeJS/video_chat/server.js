const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Serve static files from the current directory (where index.html, script.js, and style.css are)
app.use(express.static(path.join(__dirname)));

// Handle Socket.IO events as before
io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
  });

  socket.on("send-message", (message) => {
    socket.broadcast.emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

// Define the root route for serving index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

server.listen(3001, () => console.log("Server running on port 3001"));
