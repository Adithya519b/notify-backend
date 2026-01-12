const express = require("express");
const subscriptionStore = require("../models/Subscription");

const router = express.Router();

router.post("/subscribe", (req, res) => {
  subscriptionStore.set(req.body);
  console.log("📌 Subscription saved");
  res.json({ message: "Subscribed" });
});

module.exports = router;
