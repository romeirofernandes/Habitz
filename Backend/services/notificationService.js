const Chat = require("../models/chat");
const AccountabilityPartner = require("../models/accountabilityPartner");
const Habit = require("../models/habitSchema");

const notifyPartnerForMissedHabit = async (userId, habitName) => {
  try {
    // Find all accountability partners
    const partnerships = await AccountabilityPartner.find({
      $or: [{ user: userId }, { partner: userId }],
      status: "accepted",
    }).populate("user partner");

    for (const partnership of partnerships) {
      const partnerId =
        partnership.user._id.toString() === userId
          ? partnership.partner._id
          : partnership.user._id;

      // Find or create chat
      let chat = await Chat.findOne({
        participants: { $all: [userId, partnerId] },
      });

      if (!chat) {
        chat = new Chat({
          participants: [userId, partnerId],
          messages: [],
        });
      }

      // Add system message about missed habit
      const newMessage = {
        sender: partnerId, // Make it appear as from partner
        content: `👀 Your accountability partner missed their habit: ${habitName}`,
        isSystemMessage: true,
        createdAt: new Date(),
        readBy: [partnerId],
      };

      chat.messages.push(newMessage);
      await chat.save();
    }
  } catch (error) {
    console.error("Failed to notify partners:", error);
  }
};

module.exports = { notifyPartnerForMissedHabit };
