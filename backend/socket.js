const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Message = require("./models/Message");
const Session = require("./models/Session");
const { getAIResponse } = require("./services/aiService");

module.exports = (io) => {
  // Auth middleware for socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Not authorized"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = await User.findById(decoded.id).select("-password");
      next();
    } catch {
      next(new Error("Token invalid"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user?.name}`);

    socket.on("sendMessage", async ({ content, sessionId }) => {
      try {
        if (!content?.trim()) return;

        const userId = socket.user._id;

        // Get or create session
        let session = sessionId
          ? await Session.findById(sessionId)
          : await Session.create({ userId, title: content.slice(0, 30) });

        if (!session) {
          socket.emit("error", { message: "Session not found" });
          return;
        }

        // Save user message
        const userMessage = await Message.create({
          userId,
          sessionId: session._id,
          role: "user",
          content,
        });
        session.messages.push(userMessage._id);

        // Emit user message back
        socket.emit("userMessage", {
          content: userMessage.content,
          sessionId: session._id,
        });

        // Emit typing indicator
        socket.emit("aiTyping", true);

        // Build history
        const history = await Message.find({ sessionId: session._id }).sort("createdAt");
        const messages = history.map((m) => ({
          role: m.role === "ai" ? "assistant" : "user",
          content: m.content,
        }));

        // Get AI response
        const aiContent = await getAIResponse(messages);

        // Save AI message
        const aiMessage = await Message.create({
          userId,
          sessionId: session._id,
          role: "ai",
          content: aiContent,
        });
        session.messages.push(aiMessage._id);
        await session.save();

        // Stop typing & emit AI response
        socket.emit("aiTyping", false);
        socket.emit("aiMessage", {
          content: aiContent,
          sessionId: session._id,
        });
      } catch (err) {
        socket.emit("aiTyping", false);
        socket.emit("error", { message: err.message });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user?.name}`);
    });
  });
};
