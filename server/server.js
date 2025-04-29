const express = require("express"); // We're using express as our backend framework
const app = express(); // Initialize our app instance
const cors = require("cors");
const http = require("http"); //implemented for socket.io server
const {Server} = require("socket.io");
const server = http.createServer(app);
const { encrypt } = require("./encrypt"); //importing encrypt function from encrypt.js
const PORT = 8080; // Port for our backend server

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"], // This is the port vite servers run on
  methods: ["GET", "POST"],
  credentials: true, // This is to allow cookies to be sent
};

// Initialize app to use cors
app.use(cors(corsOptions));

app.get("/api", (req, res) => {
  res.json({ fruits: ["apple", "orange", "banana"] });
});

//socet.io server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

//socket connection
io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    const { sender, plaintext } = data;
    const { ciphertext, iv, salt } = encrypt(plaintext);

    console.log("🔐 Encrypted message:", { sender, plaintext, ciphertext, iv, salt });

    io.emit("receive_message", {
      sender,
      ciphertext,
      iv,
      salt
    });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(8080, () => {
  console.log("Server started on port 8080");
});
