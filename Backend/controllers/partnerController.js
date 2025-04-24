const User = require("../models/user");
const AccountabilityPartner = require("../models/accountabilityPartner");
const Chat = require("../models/chat");

// Search for users
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.body;
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
      _id: { $ne: req.user.id }, // Exclude current user
    }).select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send partner request
exports.sendPartnerRequest = async (req, res) => {
  try {
    const { partnerId } = req.body;

    // Check if you're trying to partner with yourself
    if (partnerId === req.user.id) {
      return res.status(400).json({
        message: "You cannot send a partner request to yourself",
      });
    }

    // Check if partnership already exists in any state
    const existingPartnership = await AccountabilityPartner.findOne({
      $or: [
        { user: req.user.id, partner: partnerId },
        { user: partnerId, partner: req.user.id },
      ],
    });

    if (existingPartnership) {
      return res.status(400).json({
        message: "A partnership request already exists between these users",
      });
    }

    const partnership = new AccountabilityPartner({
      user: req.user.id,
      partner: partnerId,
      status: "pending",
    });

    await partnership.save();
    res.status(201).json(partnership);
  } catch (error) {
    console.error("Send partner request error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Accept partner request
exports.acceptRequest = async (req, res) => {
  try {
    const partnership = await AccountabilityPartner.findById(req.params.id);

    if (!partnership) {
      return res.status(404).json({ message: "Partnership request not found" });
    }

    // Verify the current user is the partner
    if (partnership.partner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    partnership.status = "accepted";
    await partnership.save();

    // Create a chat room for the partners
    const chat = new Chat({
      participants: [partnership.user, partnership.partner],
    });
    await chat.save();

    res.json(partnership);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add this new function
exports.getPendingRequests = async (req, res) => {
  try {
    const pendingRequests = await AccountabilityPartner.find({
      partner: req.user.id,
      status: "pending",
    }).populate("user", "username email");

    res.json(pendingRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Decline partner request
exports.declineRequest = async (req, res) => {
  try {
    const partnership = await AccountabilityPartner.findById(req.params.id);

    if (!partnership) {
      return res.status(404).json({ message: "Partnership request not found" });
    }

    // Verify the current user is the partner
    if (partnership.partner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    partnership.status = "declined";
    await partnership.save();

    res.json(partnership);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all partners
exports.getPartners = async (req, res) => {
  try {
    const partnerships = await AccountabilityPartner.find({
      $or: [{ user: req.user.id }, { partner: req.user.id }],
      status: "accepted",
    }).populate("user partner", "username email _id"); // Make sure to include _id

    res.json(partnerships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get chat history
exports.getChatHistory = async (req, res) => {
  try {
    const { partnerId } = req.params;
    let chat = await Chat.findOne({
      participants: { $all: [req.user.id, partnerId] },
    }).populate("messages.sender", "username");

    if (!chat) {
      chat = new Chat({
        participants: [req.user.id, partnerId],
        messages: [],
      });
      await chat.save();
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { content } = req.body;

    let chat = await Chat.findOne({
      participants: { $all: [req.user.id, partnerId] },
    });

    if (!chat) {
      chat = new Chat({
        participants: [req.user.id, partnerId],
        messages: [],
      });
    }

    chat.messages.push({
      sender: req.user.id,
      content,
    });
    chat.lastMessage = Date.now();
    await chat.save();

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
