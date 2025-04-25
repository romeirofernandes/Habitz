const Habit = require("../models/habitSchema");
const User = require("../models/user");
const { scheduleReminders } = require("../services/reminderService");
const {
  notifyPartnerForMissedHabit,
} = require("../services/notificationService");

// Update the createHabit function
exports.createHabit = async (req, res) => {
  try {
    const habit = new Habit({
      ...req.body,
      user: req.user.id,
    });
    await habit.save();

    // Get user for email
    const user = await User.findById(req.user.id);

    // Schedule reminders
    await scheduleReminders(habit, user);

    res.status(201).json(habit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all habits for the current user
exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    if (habit.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already completed today
    const completedToday = habit.completedDates.some((date) => {
      const completedDate = new Date(date);
      return completedDate.toDateString() === today.toDateString();
    });

    if (completedToday) {
      return res.status(400).json({
        message: "Habit already completed today",
        completedToday: true,
      });
    }

    // Add completion and update streak
    habit.completedDates.push(today);
    habit.currentStreak += 1;
    habit.longestStreak = Math.max(habit.longestStreak, habit.currentStreak);
    await habit.save();

    res.json({
      ...habit.toObject(),
      completedToday: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
