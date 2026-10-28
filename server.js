const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files from the project folder
app.use(express.static(__dirname));

// Open the website at http://localhost:5000
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Krishi Nexus running at http://localhost:${PORT}`);
});

// Export app if needed
module.exports = app;