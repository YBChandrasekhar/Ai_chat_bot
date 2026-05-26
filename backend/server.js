const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const app = require("./app");

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

require("./socket")(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
