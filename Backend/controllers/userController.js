const User = require("../models/user");

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username email");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      googleCalendar: user.googleCalendar, 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};