const express = require("express");
const axios = require("axios");
const Recipe = require("../models/Recipe");

const router = express.Router();

// Search keywords to load Indian + International dishes
const SEARCH_KEYWORDS = [
  "chicken", "paneer", "biryani", "egg", "pasta",
  "rice", "curry", "masala", "dal", "soup", "fish"
];

// Convert meal to proper recipe format
function extractRecipe(meal) {
  if (!meal) return null;

  // Ingredients
  let ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim()) {
      ingredients.push(`${ing} - ${measure}`);
    }
  }

  return {
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
    category: meal.strCategory,
    ingredients,
    steps: meal.strInstructions?.split("\r\n").filter(x => x.trim()) || [],
    createdBy: "public-api"
  };
}

router.get("/", async (req, res) => {
  try {
    const search = req.query.search?.toLowerCase() || "";

    // 1️⃣ Get MongoDB user recipes
    const mongoRecipes = await Recipe.find();

    // 2️⃣ Fetch PUBLIC API recipes
    let publicRecipes = [];

    for (const keyword of SEARCH_KEYWORDS) {
      const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${keyword}`;

      try {
        const response = await axios.get(url);

        if (response.data.meals) {
          const meals = response.data.meals
            .map(extractRecipe)
            .filter(Boolean);

          publicRecipes.push(...meals);
        }

      } catch (err) {
        console.log("API error:", err.message);
      }
    }

    // 3️⃣ Search filter
    const filteredPublic = publicRecipes.filter(r =>
      r.title.toLowerCase().includes(search)
    );

    const filteredMongo = mongoRecipes.filter(r =>
      r.title.toLowerCase().includes(search)
    );

    res.json([...filteredPublic, ...filteredMongo]);

  } catch (err) {
    res.status(500).json({ message: "Failed to load recipes" });
  }
});

module.exports = router;
