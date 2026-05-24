const express = require("express");
const router = express.Router();

// Placeholder — implemented on Day 2
router.post("/register", (req, res) => res.json({ message: "Register route - Day 2" }));
router.post("/login", (req, res) => res.json({ message: "Login route - Day 2" }));

module.exports = router;
