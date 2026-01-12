const express = require("express");
const webpush = require("../config/vapid");
const reminders = require("../models/Reminder");
const subscriptionStore = require("../models/Subscription");

const router = express.Router();

router.post("/reminder", (req, res) => {
  const { title, time } = req.body;

  const subscription = subscriptionStore.get();
  if (!subscription) {
    return res.status(400).json({ error: "No subscription found" });
  }

  const reminderTime = new Date(time).getTime();
  const delay = reminderTime - Date.now();

  if (delay <= 0) {
    return res.status(400).json({ error: "Time must be in future" });
  }

  const reminder = { title, time, sent: false };
  reminders.push(reminder);

  setTimeout(async () => {
    const payload = JSON.stringify({
      title: "⏰ Reminder",
      body: title
    });

    try {
      await webpush.sendNotification(subscription, payload);
      reminder.sent = true;
      console.log("🔔 Reminder sent:", title);
    } catch (err) {
      console.error("Push error:", err);
    }
  }, delay);

  console.log("⏰ Reminder scheduled:", title, time);
  res.json({ message: "Reminder set successfully" });
});

module.exports = router;
