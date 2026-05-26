const User = require("../models/User");
const Message = require("../models/Message");
const Session = require("../models/Session");

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort("-createdAt");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get analytics overview
const getAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalMessages, totalSessions, aiMessages] = await Promise.all([
      User.countDocuments(),
      Message.countDocuments(),
      Session.countDocuments(),
      Message.countDocuments({ role: "ai" }),
    ]);

    // Users registered in last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    // Messages per day (last 7 days)
    const messagesPerDay = await Message.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Rating stats
    const ratings = await Message.aggregate([
      { $match: { role: "ai", rating: { $ne: null } } },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
    ]);

    res.json({
      totalUsers,
      totalMessages,
      totalSessions,
      aiMessages,
      newUsers,
      messagesPerDay,
      ratings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle user active status
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? "activated" : "deactivated"}`, isActive: user.isActive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Make user admin
const makeAdmin = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role: "admin" },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User promoted to admin", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getUsers, getAnalytics, toggleUserStatus, makeAdmin };
