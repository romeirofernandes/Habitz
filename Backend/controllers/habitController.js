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

// Check/complete a habit
exports.checkHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    // Check if habit was completed in last 30 seconds
    const now = new Date();
    const thirtySecondsAgo = new Date(now - 30000); // 30 seconds in milliseconds

    const wasCompletedRecently = habit.completedDates.some((date) => {
      const completedDate = new Date(date);
      return completedDate >= thirtySecondsAgo;
    });

    // Check if habit was completed in previous 30 seconds
    const sixtySecondsAgo = new Date(now - 60000);
    const wasCompletedPreviously = habit.completedDates.some((date) => {
      const completedDate = new Date(date);
      return (
        completedDate >= sixtySecondsAgo && completedDate < thirtySecondsAgo
      );
    });

    // If habit was missed and had a streak
    if (
      !wasCompletedRecently &&
      !wasCompletedPreviously &&
      habit.currentStreak > 0
    ) {
      await notifyPartnerForMissedHabit(req.user.id, habit.name);
    }

    // ... rest of your existing code
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
