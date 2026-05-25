const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: [process.env.CLIENT_URL, "http://localhost:3000", "http://localhost:3001"], credentials: true }));
app.use(express.json());

// Routes (to be added in upcoming days)
app.use("/api/auth", require("./routes/auth"));
app.use("/api/chat", require("./routes/chat"));

app.get("/", (req, res) => res.json({ message: "Chatbot API running" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
