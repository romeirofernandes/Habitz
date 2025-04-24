const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  frequency: {
    type: String,
    enum: ["daily", "weekly"],
    default: "daily",
  },
  timeOfDay: {
    type: String,
    required: true,
  },
  completedDates: [
    {
      type: Date,
    },
  ],
  currentStreak: {
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

habitSchema.virtual("completedToday").get(function () {
  if (this.completedDates.length === 0) return false;
  const today = new Date();
  const lastCompleted = new Date(
    this.completedDates[this.completedDates.length - 1]
  );
  return (
    lastCompleted.getDate() === today.getDate() &&
    lastCompleted.getMonth() === today.getMonth() &&
    lastCompleted.getFullYear() === today.getFullYear()
  );
});

module.exports = mongoose.model("Habit", habitSchema);
