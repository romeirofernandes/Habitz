const schedule = require("node-schedule");
const { sendReminderEmail, sendMissedHabitEmail } = require("./emailService");
const Habit = require("../models/habitSchema");
const User = require("../models/user");

const scheduleReminders = async (habit, user) => {
  const [hours, minutes] = habit.timeOfDay.split(":");
  const reminderTime = new Date();
  reminderTime.setHours(hours, minutes - 15, 0); // 15 minutes before

  // Schedule the initial reminder
  schedule.scheduleJob(reminderTime, async () => {
    await sendReminderEmail(user.email, habit.name, habit.timeOfDay);
  });

  // Schedule the missed habit check
  const missedCheckTime = new Date();
  missedCheckTime.setHours(hours, parseInt(minutes) + 30, 0); // 30 minutes after

  schedule.scheduleJob(missedCheckTime, async () => {
    const updatedHabit = await Habit.findById(habit._id);
    if (!updatedHabit.completedToday) {
      await sendMissedHabitEmail(user.email, habit.name);
    }
  });
};

module.exports = { scheduleReminders };
