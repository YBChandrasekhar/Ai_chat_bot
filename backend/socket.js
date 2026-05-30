const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Message = require("./models/Message");
const Session = require("./models/Session");
const { getAIResponse } = require("./services/aiService");

module.exports = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Not authorized"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return next(new Error("User not found"));
      if (user.isActive === false) return next(new Error("Account deactivated. Please contact admin."));
      socket.user = user;
      next();
    } catch {
      next(new Error("Token invalid"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`✅ Connected: ${socket.user?.name}`);

    socket.on("sendMessage", async ({ content, sessionId }) => {
      try {
        if (!content?.trim()) return;

        const userId = socket.user._id;
        const category = socket.user.preferences?.category || "casual";

        let session = sessionId
          ? await Session.findById(sessionId)
          : await Session.create({ userId, title: content.slice(0, 30) });

        if (!session) {
          socket.emit("error", { message: "Session not found" });
          return;
        }

        const userMessage = await Message.create({
          userId,
          sessionId: session._id,
          role: "user",
          content: content.trim(),
        });
        session.messages.push(userMessage._id);
        await session.save();

        socket.emit("userMessage", {
          content: userMessage.content,
          sessionId: session._id,
        });

        socket.emit("aiTyping", true);

        const history = await Message.find({ sessionId: session._id }).sort("createdAt").lean();
        const messages = history.map((m) => ({
          role: m.role === "ai" ? "assistant" : "user",
          content: m.content,
        }));

        const aiContent = await getAIResponse(messages, category);

        const aiMessage = await Message.create({
          userId,
          sessionId: session._id,
          role: "ai",
          content: aiContent,
        });
        session.messages.push(aiMessage._id);
        await session.save();

        socket.emit("aiTyping", false);
        socket.emit("aiMessage", {
          content: aiContent,
          sessionId: session._id,
          messageId: aiMessage._id,
        });
      } catch (err) {
        console.error("Socket error:", err.message);
        socket.emit("aiTyping", false);
        socket.emit("error", { message: "Failed to get AI response. Please try again." });
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ Disconnected: ${socket.user?.name}`);
    });
  });
};
