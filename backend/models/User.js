const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
    theme: { type: String, enum: ["dark", "light"], default: "dark" },
    chatbotName: { type: String, default: "AI Assistant" },
    category: { type: String, enum: ["casual", "professional", "creative"], default: "casual" },
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
