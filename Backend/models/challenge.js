const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  participants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      progress: { type: Number, default: 0 },
      completed: { type: Boolean, default: false },
    },
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Challenge", challengeSchema);