const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const webpush = require("./config/vapid");
const reminders = require("./models/Reminder");

require("./jobs/reminderCron");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

// TEMP subscription store
let subscriptions = [];
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


// Receive subscription
app.post("/subscribe", (req, res) => {
  subscriptions.push(req.body);
  console.log("📌 Subscription saved");
  res.json({ success: true });
});

// Schedule reminder
app.post("/reminder", (req, res) => {
  const { title, time, subscription } = req.body;

  if (!title || !time ) {
    return res.status(400).json({ error: "Invalid reminder data" });
  }

  reminders.push({
    title,
    time,
    subscription,
    sent: false
  });

  console.log("⏰ Reminder scheduled:", title, time);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
