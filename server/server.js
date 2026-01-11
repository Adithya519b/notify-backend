const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const webpush = require("./config/vapid");
const reminders = require("./models/Reminder");
require("./jobs/reminderCron");


const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// TEMP storage (later DB)
let subscriptions = [];

// Receive subscription from frontend
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  console.log("📌 Subscription received");

  res.status(201).json({ message: "Subscription saved" });
});

// Send test push
app.post("/send-test", async (req, res) => {
  const payload = JSON.stringify({
    title: "Test Reminder 🔔",
    body: "Backend push working successfully!"
  });

  try {
    for (let sub of subscriptions) {
      await webpush.sendNotification(sub, payload);
    }
    res.json({ message: "Push sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Push failed" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
app.post("/reminder", (req, res) => {
  const { title, time, subscription } = req.body;

  reminders.push({
    title,
    time,
    subscription,
    sent: false
  });

  console.log("⏰ Reminder saved:", title, time);
  res.json({ message: "Reminder scheduled" });
});

