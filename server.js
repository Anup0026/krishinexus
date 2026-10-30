const express = require("express");
const path = require("node:path");
require("dotenv").config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// The same Express app is used locally and by Vercel's serverless runtime.
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  next();
});

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "Krishi Nexus",
    timestamp: new Date().toISOString()
  });
});

app.use(express.static(__dirname, {
  index: false,
  dotfiles: "deny",
  etag: true,
  maxAge: process.env.NODE_ENV === "production" ? "1h" : 0
}));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Vercel imports this handler; local Node execution starts an HTTP listener.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Krishi Nexus running at http://localhost:${PORT}`);
  });
}

module.exports = app;
