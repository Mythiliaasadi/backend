const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// HTTP server
const server = http.createServer(app);

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

// make io available
app.set("io", io);

// ROUTES
const authRoutes = require("./routes/authRoutes");
const queueRoutes = require("./routes/queueRoutes");

// APIs
app.use("/api/auth", authRoutes);
app.use("/api/queue", queueRoutes);

// TEST
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// MONGO
mongoose.connect(process.env.MONGO_URI)
.then(() => {

  console.log("MongoDB Connected");

  server.listen(5000, () => {
    console.log("Server running on port 5000");
  });

})
.catch((err) => {
  console.log(err);
});