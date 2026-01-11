const webpush = require("web-push");

const PUBLIC_KEY = "BAjfTioO3MTqlkLD3jMZoHnX89kAdQ17tSVY7pmA-QjHzSiVKmzxrnmouTqvRDSqycvUNgDPsKm7E6SY6GtZ5lk";
const PRIVATE_KEY = "ebm-yq5MHHrhk3h4QeU_SUNkb1JpIxvdcELSbJZFw9U";

webpush.setVapidDetails(
  "mailto:test@example.com",
  PUBLIC_KEY,
  PRIVATE_KEY
);

module.exports = webpush;
