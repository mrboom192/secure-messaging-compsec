const express = require("express"); // We're using express as our backend framework
const app = express(); // Initialize our app instance
const cors = require("cors");
const http = require("http"); //implemented for socket.io server
const {Server} = require("socket.io");
const server = http.createServer(app);

const corsOptions = {
  origin: ["http://localhost:5173"], // This is the port vite servers run on
};

// Initialize app to use cors
app.use(cors(corsOptions));

app.get("/api", (req, res) => {
  res.json({ fruits: ["apple", "orange", "banana"] });
});

//socet.io server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

//socket connection
io.on("connection", (socket) =>{
  console.log("A user connected: ${socket.id}");
  socket.on("send_message", (data) => {
    console.log("Message was received",data);
    io.emit("receive_message", data); //send message to everyone
  });
  socket.on("disconnect", () => {
    console.log("User disconnected: ${socket.id}");
  });
});



server.listen(8080, () => {
  console.log("Server started on port 8080");
});
