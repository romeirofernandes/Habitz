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

// Get a single habit
exports.getHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    if (habit.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a habit
exports.updateHabit = async (req, res) => {
  try {
    let habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    if (habit.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    habit = await Habit.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    // Update reminders if reminder settings changed
    if (req.body.reminderSettings) {
      const user = await User.findById(req.user.id);
      await scheduleReminders(habit, user);
    }

    res.json(habit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a habit
exports.deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    if (habit.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await habit.deleteOne();
    res.json({ message: "Habit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Complete a habit
exports.completeHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    if (habit.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Check if already completed today
    const today = new Date();
    const alreadyCompleted = habit.completedDates.some((date) => {
      const d = new Date(date);
      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    });

    if (alreadyCompleted) {
      return res
        .status(400)
        .json({ message: "Already completed today", completedToday: true });
    }

    // Add current date to completedDates
    habit.completedDates.push(today);

    // Update streak
    const lastCompletedDate =
      habit.completedDates[habit.completedDates.length - 2];
    const oneDayInMs = 24 * 60 * 60 * 1000;

    if (
      lastCompletedDate &&
      today - new Date(lastCompletedDate) <= oneDayInMs
    ) {
      habit.currentStreak += 1;
      if (habit.currentStreak > habit.longestStreak) {
        habit.longestStreak = habit.currentStreak;
      }
    } else {
      habit.currentStreak = 1;
    }

    await habit.save();

    res.json({ ...habit.toObject(), completedToday: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
