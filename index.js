const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authMiddleware = require("./middleware/authMiddleware");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(authMiddleware);

// Routes
const marksRoutes = require("./routes/marksRoutes");
const studentsRoutes = require("./routes/studentsRoutes");
const apiRoutes = require("./routes/api");

// API routes
app.use("/api/marks", marksRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api", apiRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Internal Marks Management System API is running"
  });
});

// MongoDB connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is not defined in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });