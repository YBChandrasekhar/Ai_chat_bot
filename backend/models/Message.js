const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
  role: { type: String, enum: ["user", "ai"], required: true },
  content: { type: String, required: true },
  rating: { type: String, enum: ["like", "dislike", null], default: null },
}, { timestamps: true });

messageSchema.index({ sessionId: 1, createdAt: 1 });
messageSchema.index({ userId: 1 });

module.exports = mongoose.model("Message", messageSchema);
