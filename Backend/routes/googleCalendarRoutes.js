const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/user");
const {
  getAuthUrl,
  getTokens,
  addHabitToCalendar,
} = require("../services/googleCalendarService");

router.get("/callback", async (req, res) => {
  try {
    const { code, state } = req.query; // state = userId
    const tokens = await getTokens(code);

    // Store tokens in user document
    await User.findByIdAndUpdate(state, {
      $set: {
        "googleCalendar.tokens": tokens,
        "googleCalendar.connected": true,
      },
    });

    res.redirect(
      `https://habitz-three.vercel.app/dashboard?googleCalendarConnected=1`
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.use(auth);

router.get("/auth-url", async (req, res) => {
  try {
    const url = getAuthUrl(req.user.id); // Pass user ID from auth middleware
    res.json({ url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/sync-all", async (req, res) => {
  try {
    const habits = await require("../models/habitSchema").find({
      user: req.user.id,
      syncWithGoogleCalendar: true,
    });

    const results = [];
    for (const habit of habits) {
      const result = await addHabitToCalendar(req.user.id, habit);
      if (result.success) {
        habit.googleCalendarEventId = result.eventId;
        await habit.save();
      }
      results.push({ habitId: habit._id, ...result });
    }
    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sync habit to calendar
router.post("/sync/:habitId", async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.habitId);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    if (habit.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const result = await addHabitToCalendar(req.user.id, habit);

    if (result.success) {
      // Store the Google Calendar event ID with the habit
      habit.googleCalendarEventId = result.eventId;
      await habit.save();
      res.json({ success: true, eventId: result.eventId });
    } else {
      res
        .status(400)
        .json({ message: result.message || "Failed to sync with calendar" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Disconnect Google Calendar
router.delete("/disconnect", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $unset: { "googleCalendar.tokens": "" },
      "googleCalendar.connected": false,
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
