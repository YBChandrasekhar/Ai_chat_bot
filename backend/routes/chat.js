const express = require("express");
const router = express.Router();

// Placeholder — implemented on Day 3
router.post("/message", (req, res) => res.json({ message: "Chat route - Day 3" }));

module.exports = router;
