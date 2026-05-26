const express = require("express");
const router = express.Router();
const { getPreferences, updatePreferences, rateMessage } = require("../controllers/preferencesController");
const protect = require("../middleware/authMiddleware");

router.get("/", protect, getPreferences);
router.put("/", protect, updatePreferences);
router.put("/rate/:messageId", protect, rateMessage);

module.exports = router;
