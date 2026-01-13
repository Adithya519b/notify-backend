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

app.post("/reminder", async (req, res) => {
  console.log("🔥 Sending push NOW");

  await webpush.sendNotification(subscription, JSON.stringify({
    title: "TEST",
    body: "Immediate push test"
  }));

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
