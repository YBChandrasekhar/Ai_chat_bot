const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"], credentials: true }));
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/preferences", require("./routes/preferences"));

app.get("/", (req, res) => res.json({ message: "Chatbot API running" }));

app.use(errorHandler);

module.exports = app;
