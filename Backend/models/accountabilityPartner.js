const mongoose = require("mongoose");

const accountabilityPartnerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending"
  },
  lastInteraction: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("AccountabilityPartner", accountabilityPartnerSchema);