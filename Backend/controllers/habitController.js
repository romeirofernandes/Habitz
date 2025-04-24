const Habit = require("../models/habitSchema");

// Get all habits
exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.find().sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new habit
exports.createHabit = async (req, res) => {
  try {
    const habit = new Habit(req.body);
    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Check/complete a habit
exports.checkHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If not already completed today
    if (!habit.completedToday) {
      habit.completedDates.push(new Date());

      // Update streak
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const wasCompletedYesterday = habit.completedDates.some((date) => {
        const completedDate = new Date(date);
        return completedDate.getTime() === yesterday.getTime();
      });

      if (wasCompletedYesterday) {
        habit.currentStreak += 1;
      } else {
        habit.currentStreak = 1;
      }

      if (habit.currentStreak > habit.longestStreak) {
        habit.longestStreak = habit.currentStreak;
      }

      await habit.save();
    }

    res.json(habit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
