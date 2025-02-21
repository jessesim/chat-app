const express = require("express");
const http = require("http");
const WebSocket = require("ws");

// Initialize Express
const app = express();
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocket.Server({ server });

// Serve static files from the "public" directory
app.use(express.static("public"));

// Store connected clients
const clients = new Set();

// Handle WebSocket connections
wss.on("connection", (ws) => {
  console.log("New client connected!");
  clients.add(ws);

  // Broadcast messages to all clients
  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
    clients.forEach((client) => {
      if (client != ws && client.readyState === client.OPEN) {
        client.send(message.toString());
      }
    });
  });

  // Handle client disconnect
  ws.on("close", () => {
    console.log("Client disconnected");
    clients.delete(ws);
  });
});

// Start the server
const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});