const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, default: "New Chat" },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
}, { timestamps: true });

// Optimize query performance
sessionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Session", sessionSchema);
