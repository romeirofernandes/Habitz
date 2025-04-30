const User = require("../models/user");
const AccountabilityPartner = require("../models/accountabilityPartner");
const Chat = require("../models/chat");
const Habit = require("../models/habitSchema");

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

    if (partnership.partner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [partnership.user, partnership.partner] },
    });

    if (!chat) {
      chat = new Chat({
        participants: [partnership.user, partnership.partner],
      });
      await chat.save();
    }

    partnership.status = "accepted";
    await partnership.save();

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

// Update the getChatHistory function
exports.getChatHistory = async (req, res) => {
  try {
    const { partnerId } = req.params;
    let chat = await Chat.findOne({
      participants: { $all: [req.user.id, partnerId] },
    }).populate({
      path: "messages.sender",
      select: "username _id",
    });

    if (!chat) {
      chat = new Chat({
        participants: [req.user.id, partnerId],
        messages: [],
      });
      await chat.save();
    }

    res.json({ chatId: chat._id, messages: chat.messages });
  } catch (error) {
    console.error("Error getting chat history:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update the sendMessage function
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

    const newMessage = {
      sender: req.user.id,
      content,
      readBy: [req.user.id],
      createdAt: new Date(),
    };

    chat.messages.push(newMessage);
    await chat.save();

    // Populate the sender info before sending response
    const populatedChat = await Chat.findById(chat._id).populate({
      path: "messages.sender",
      select: "username _id",
    });

    const sentMessage =
      populatedChat.messages[populatedChat.messages.length - 1];
    res.status(201).json(sentMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add or update this function
exports.getUnreadCounts = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.id,
    });

    const unreadCounts = {};

    for (const chat of chats) {
      const partnerId = chat.participants
        .find((p) => p.toString() !== req.user.id)
        .toString();

      const unreadMessages = chat.messages.filter(
        (msg) =>
          msg.sender.toString() !== req.user.id &&
          !msg.readBy.includes(req.user.id)
      ).length;

      if (unreadMessages > 0) {
        unreadCounts[partnerId] = unreadMessages;
      }
    }

    res.json(unreadCounts);
  } catch (error) {
    console.error("Error getting unread counts:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add new endpoint for unfriending
exports.removePartner = async (req, res) => {
  try {
    const { partnerId } = req.params;

    const partnership = await AccountabilityPartner.findOne({
      $or: [
        { user: req.user.id, partner: partnerId },
        { user: partnerId, partner: req.user.id },
      ],
      status: "accepted",
    });

    if (!partnership) {
      return res.status(404).json({ message: "Partnership not found" });
    }

    await AccountabilityPartner.deleteOne({ _id: partnership._id });
    await Chat.deleteOne({
      participants: { $all: [req.user.id, partnerId] },
    });

    res.json({ message: "Partnership removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPartnerProgress = async (req, res) => {
  try {
    const { partnerId } = req.params;

    // Verify partnership exists
    const partnership = await AccountabilityPartner.findOne({
      $or: [
        { user: req.user.id, partner: partnerId },
        { user: partnerId, partner: req.user.id },
      ],
      status: "accepted",
    });

    if (!partnership) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this user's progress" });
    }

    const habits = await Habit.find({ user: partnerId }).select(
      "name description currentStreak longestStreak completedDates"
    );

    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendAutomatedMessage = async (userId, partnerId, message) => {
  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, partnerId] },
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, partnerId],
        messages: [],
      });
    }

    const automatedMessage = {
      sender: userId,
      content: message,
      type: "automated",
      readBy: [],
      createdAt: new Date(),
    };

    chat.messages.push(automatedMessage);
    await chat.save();

    // Emit socket event for real-time updates
    global.io
      .to(chat._id.toString())
      .emit("message-received", automatedMessage);

    return automatedMessage;
  } catch (error) {
    console.error("Error sending automated message:", error);
    throw error;
  }
};
