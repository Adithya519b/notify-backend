const cron = require("node-cron");
const webpush = require("../config/vapid");
const reminders = require("../models/Reminder");

// Run every minute
cron.schedule("* * * * *", async () => {
  const now = new Date();

  for (let reminder of reminders) {
    if (!reminder.sent && new Date(reminder.time) <= now) {

      const payload = JSON.stringify({
        title: "⏰ Reminder",
        body: reminder.title
      });

      try {
        await webpush.sendNotification(reminder.subscription, payload);
        reminder.sent = true;
        console.log("🔔 Reminder sent:", reminder.title);
      } catch (err) {
        console.error("Push failed", err);
      }
    }
  }
});
