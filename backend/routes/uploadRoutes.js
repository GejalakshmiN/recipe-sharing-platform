const express = require("express");
const upload = require("../middleware/upload");
const router = express.Router();

// Log when file loads
console.log("🚀 uploadRoutes.js LOADED");

// Test if route is hit
router.post(
  "/image",
  (req, res, next) => {
    console.log("🔥 HIT POST /upload/image");
    next();
  },
  upload.single("image"),
  (req, res) => {
    try {
      console.log("📸 Uploaded file:", req.file);

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      return res.json({ imageUrl: req.file.path });
    } catch (err) {
      console.error("❌ Upload error:", err.message);
      return res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
