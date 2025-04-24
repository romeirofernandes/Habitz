const Habit = require("../models/habitSchema");

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

// Create a new habit
exports.createHabit = async (req, res) => {
  try {
    const habit = new Habit({
      ...req.body,
      user: req.user.id,
    });
    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Check/complete a habit
exports.checkHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isCompletedToday = habit.completedDates.some((date) => {
      const completedDate = new Date(date);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    });

    // If not already completed today
    if (!isCompletedToday) {
      habit.completedDates.push(new Date());

      // Update streak
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const wasCompletedYesterday = habit.completedDates.some((date) => {
        const completedDate = new Date(date);
        completedDate.setHours(0, 0, 0, 0);
        return completedDate.getTime() === yesterday.getTime();
      });

      if (wasCompletedYesterday || habit.currentStreak === 0) {
        habit.currentStreak += 1;
      } else {
        habit.currentStreak = 1;
      }

      if (habit.currentStreak > habit.longestStreak) {
        habit.longestStreak = habit.currentStreak;
      }

      await habit.save();
      res.json({ ...habit.toObject(), completedToday: true });
    } else {
      res.json({ ...habit.toObject(), completedToday: true });
    }
  } catch (error) {
    console.error("Check habit error:", error);
    res.status(400).json({ message: error.message });
  }
};
