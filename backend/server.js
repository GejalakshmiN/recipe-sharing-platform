require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(cors());
app.use(express.json());

// Check MongoDB URI
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI missing in .env");
  process.exit(1);
}

console.log("🔗 Using MONGO_URI:", process.env.MONGO_URI.slice(0, 30) + "...");

// Connect to Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

// Test Root Route
app.get("/", (req, res) => {
  res.json({ message: "Backend working!" });
});

// Serve local uploaded images (if any)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ROUTES
app.use("/auth", require("./routes/authRoutes"));              // Register / Login
app.use("/recipes/public", require("./routes/publicRecipes")); // Free public API
app.use("/recipes", require("./routes/recipes"));              // CRUD (protected)
app.use("/upload", require("./routes/uploadRoutes"));


// 404 fallback
app.use((req, res) => res.status(404).json({ message: "Not Found" }));

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
