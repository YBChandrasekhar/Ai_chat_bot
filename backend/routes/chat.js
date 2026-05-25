const express = require("express");
const router = express.Router();
const { sendMessage, getHistory } = require("../controllers/chatController");
const protect = require("../middleware/authMiddleware");
const { validateMessage } = require("../middleware/validate");
const { chatLimiter } = require("../middleware/rateLimiter");

router.post("/message", protect, chatLimiter, validateMessage, sendMessage);
router.get("/history", protect, getHistory);

module.exports = router;
