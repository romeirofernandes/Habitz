const nodemailer = require("nodemailer");
require('dotenv').config();

if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
  console.error("Missing required email configuration!");
  console.log("GMAIL_USER:", !!process.env.GMAIL_USER);
  console.log("GMAIL_APP_PASSWORD:", !!process.env.GMAIL_APP_PASSWORD);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Test the connection with better error logging
transporter.verify(function (error, success) {
  if (error) {
    console.error("Email service error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
      command: error.command,
    });
  } else {
    console.log("Email server is ready");
  }
});

const sendReminderEmail = async (to, habitName, time) => {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject: `Reminder: Time for your habit - ${habitName}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>⏰ Time for your habit!</h2>
          <p>Hey there! This is a friendly reminder that it's time for:</p>
          <h3 style="color: #A2BFFE;">${habitName}</h3>
          <p>Scheduled for: ${time}</p>
          <p>Keep up the great work! 💪</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
};

const sendMissedHabitEmail = async (to, habitName) => {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject: `Missed your habit? - ${habitName}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>👋 Quick Check-in</h2>
          <p>We noticed you haven't marked your habit as complete:</p>
          <h3 style="color: #A2BFFE;">${habitName}</h3>
          <p>Did you complete it? Don't forget to mark it in the app!</p>
          <p>Remember: consistency is key to building lasting habits. 🌱</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
};

module.exports = {
  sendReminderEmail,
  sendMissedHabitEmail,
};
