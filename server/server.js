const express = require("express"); // We're using express as our backend framework
const app = express(); // Initialize our app instance
const cors = require("cors");
const corsOptions = {
  origin: ["http://localhost:5173"], // This is the port vite servers run on
};

// Initialize app to use cors
app.use(cors(corsOptions));

app.get("/api", (req, res) => {
  res.json({ fruits: ["apple", "orange", "banana"] });
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
