const express = require("express");
const Recipe = require("../models/Recipe");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

/* -------------------------------------------------
   GET ALL RECIPES (PUBLIC)
------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -------------------------------------------------
   GET MY RECIPES (PROTECTED)
------------------------------------------------- */
router.get("/my", verifyToken, async (req, res) => {
  try {
    const recipes = await Recipe.find({
      createdBy: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -------------------------------------------------
   GET SAVED RECIPES (PROTECTED)  ✅ MUST BE ABOVE :id
------------------------------------------------- */
router.get("/saved/all", verifyToken, async (req, res) => {
  try {
    const recipes = await Recipe.find({
      savedBy: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -------------------------------------------------
   GET SINGLE RECIPE
------------------------------------------------- */
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      "comments.user",
      "name email"
    );

    if (!recipe)
      return res.status(404).json({ message: "Recipe not found" });

    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -------------------------------------------------
   CREATE RECIPE
------------------------------------------------- */
router.post("/", verifyToken, async (req, res) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      createdBy: req.user.id,
    });

    const saved = await recipe.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* -------------------------------------------------
   UPDATE RECIPE (OWNER ONLY)
------------------------------------------------- */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe)
      return res.status(404).json({ message: "Recipe not found" });

    if (recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(recipe, req.body);
    await recipe.save();

    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -------------------------------------------------
   DELETE RECIPE (OWNER ONLY)
------------------------------------------------- */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe)
      return res.status(404).json({ message: "Recipe not found" });

    if (recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await recipe.deleteOne();
    res.json({ message: "Recipe deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -------------------------------------------------
   LIKE / UNLIKE  ✅ FIXED ObjectId comparison
------------------------------------------------- */
router.post("/:id/like", verifyToken, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Not found" });

    const userId = req.user.id;

    const index = recipe.likes.findIndex(
      (id) => id.toString() === userId
    );

    if (index === -1) recipe.likes.push(userId);
    else recipe.likes.splice(index, 1);

    await recipe.save();
    res.json({ likes: recipe.likes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -------------------------------------------------
   SAVE / UNSAVE  ✅ FIXED ObjectId comparison
------------------------------------------------- */
router.post("/:id/save", verifyToken, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Not found" });

    const userId = req.user.id;

    const index = recipe.savedBy.findIndex(
      (id) => id.toString() === userId
    );

    if (index === -1) recipe.savedBy.push(userId);
    else recipe.savedBy.splice(index, 1);

    await recipe.save();
    res.json({ saved: index === -1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -------------------------------------------------
   COMMENT
------------------------------------------------- */
router.post("/:id/comment", verifyToken, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Not found" });

    recipe.comments.push({
      user: req.user.id,
      text: req.body.text,
    });

    await recipe.save();
    res.json(recipe.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
