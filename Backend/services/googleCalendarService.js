const { google } = require("googleapis");
const User = require("../models/user");
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Export everything as named exports
exports.getAuthUrl = (userId) => {
  const scopes = ["https://www.googleapis.com/auth/calendar"];
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
    state: userId,
  });
};

exports.getTokens = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

exports.addHabitToCalendar = async (userId, habit) => {
  try {
    const user = await User.findById(userId);
    if (!user.googleCalendar?.tokens) {
      return { success: false, message: "Google Calendar not connected" };
    }

    oauth2Client.setCredentials(user.googleCalendar.tokens);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // --- FIXED DATE LOGIC ---
    // Get today's date in YYYY-MM-DD
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    // Parse timeOfDay (e.g. "09:30")
    const [hours, minutes] = habit.timeOfDay.split(":").map(Number);

    // Create start and end Date objects for today at the specified time
    const startTime = new Date(`${formattedDate}T${habit.timeOfDay}:00`);
    const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 min duration

    // Build the event object
    const event = {
      summary: habit.name,
      description: habit.description || "",
      start: {
        dateTime: startTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      reminders: {
        useDefault: false,
        overrides: [
          {
            method: "popup",
            minutes: habit.reminderSettings?.reminderTime || 10,
          },
        ],
      },
      recurrence: ["RRULE:FREQ=DAILY"],
    };

    // Create the event in Google Calendar
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    return { success: true, eventId: response.data.id };
  } catch (error) {
    console.error("Calendar API Error:", error);
    return { success: false, message: error.message };
  }
};

exports.removeHabitFromCalendar = async (userId, habit) => {
  try {
    if (!habit.googleCalendarEventId) {
      return { success: true };
    }

    const user = await User.findById(userId);
    if (!user.googleCalendar?.tokens) {
      return { success: false, message: "Google Calendar not connected" };
    }

    oauth2Client.setCredentials(user.googleCalendar.tokens);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    await calendar.events.delete({
      calendarId: "primary",
      eventId: habit.googleCalendarEventId,
    });

    return { success: true };
  } catch (error) {
    console.error("Error removing event:", error);
    return { success: false, message: error.message };
  }
};
