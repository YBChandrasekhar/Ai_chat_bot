const express = require("express");
const router = express.Router();
const { getUsers, getAnalytics, toggleUserStatus, makeAdmin } = require("../controllers/adminController");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

router.use(protect, adminOnly);

router.get("/users", getUsers);
router.get("/analytics", getAnalytics);
router.put("/users/:userId/toggle", toggleUserStatus);
router.put("/users/:userId/make-admin", makeAdmin);

module.exports = router;
