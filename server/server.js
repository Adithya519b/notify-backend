const express = require("express");
const cors = require("cors");
const webpush = require("./config/vapid");

const reminders = require("./models/Reminder");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// TEMP subscription store (single user for now)
let subscription = null;

// Health check
app.get("/health", (req, res) => {
  res.send("Backend running ✅");
});

// Save push subscription
app.post("/subscribe", (req, res) => {
  subscription = req.body;
  console.log("📌 Subscription saved");
  res.json({ message: "Subscribed successfully" });
});

// Set reminder
app.post("/reminder", (req, res) => {
  const { title, time } = req.body;

  if (!subscription) {
    return res.status(400).json({ error: "No subscription found" });
  }

  const reminderTime = new Date(time).getTime();
  const delay = reminderTime - Date.now();

  if (delay <= 0) {
    return res.status(400).json({ error: "Time must be in the future" });
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
      console.error("❌ Push failed:", err);
    }
  }, delay);

  console.log("⏰ Reminder scheduled:", title, time);
  res.json({ message: "Reminder set successfully" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
