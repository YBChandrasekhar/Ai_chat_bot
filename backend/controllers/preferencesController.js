const User = require("../models/User");
const Message = require("../models/Message");

const getPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("preferences name email");
    if (!user.preferences) {
      user.preferences = { theme: "dark", chatbotName: "AI Assistant", category: "casual" };
      await user.save();
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updatePreferences = async (req, res) => {
  try {
    const { theme, chatbotName, category } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferences: { theme, chatbotName, category } },
      { new: true }
    ).select("preferences name email");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const rateMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { rating } = req.body;

    if (!["like", "dislike"].includes(rating))
      return res.status(400).json({ message: "Invalid rating" });

    const message = await Message.findByIdAndUpdate(
      messageId,
      { rating },
      { new: true }
    );
    if (!message) return res.status(404).json({ message: "Message not found" });

    res.json({ message: "Rating saved", rating: message.rating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getPreferences, updatePreferences, rateMessage };
