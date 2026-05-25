const { getAIResponse } = require("../services/aiService");
const Message = require("../models/Message");
const Session = require("../models/Session");

const sendMessage = async (req, res) => {
  try {
    const { content, sessionId } = req.body;
    const userId = req.user._id;

    if (!content) return res.status(400).json({ message: "Message content required" });

    // Get or create session
    let session = sessionId
      ? await Session.findById(sessionId)
      : await Session.create({ userId, title: content.slice(0, 30) });

    if (!session) return res.status(404).json({ message: "Session not found" });

    // Save user message
    const userMessage = await Message.create({ userId, sessionId: session._id, role: "user", content });
    session.messages.push(userMessage._id);

    // Build conversation history for OpenAI
    const history = await Message.find({ sessionId: session._id }).sort("createdAt");
    const openAIMessages = history.map((m) => ({ role: m.role === "ai" ? "assistant" : "user", content: m.content }));

    // Get AI response
    const aiContent = await getAIResponse(openAIMessages);

    // Save AI message
    const aiMessage = await Message.create({ userId, sessionId: session._id, role: "ai", content: aiContent });
    session.messages.push(aiMessage._id);
    await session.save();

    res.json({ sessionId: session._id, userMessage: userMessage.content, aiMessage: aiContent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user._id })
      .sort("-createdAt")
      .populate("messages");
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { sendMessage, getHistory };
