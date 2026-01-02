import { useEffect, useState } from "react";
import axios from "../api/axios";

function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const fetchMyRecipes = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in");
        return;
      }

      // 🔑 Decode JWT (same logic as ViewRecipe)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.id;

      // ✅ Fetch ALL recipes
      const res = await axios.get("/recipes");

      // ✅ Filter only recipes created by this user
      const myRecipes = res.data.filter(
        (recipe) => recipe.createdBy === userId
      );

      setRecipes(myRecipes);
    } catch (err) {
      console.error(err);
      alert("Failed to load your recipes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">My Recipes</h1>

      {loading && <p>Loading...</p>}

      {!loading && recipes.length === 0 && (
        <p>You haven’t added any recipes yet.</p>
      )}

      {!loading &&
        recipes.map((recipe) => (
          <div
            key={recipe._id}
            className="card mb-4 p-3"
          >
            <h4>{recipe.title}</h4>

            {recipe.image && (
              <img
                src={recipe.image}
                alt="recipe"
                className="img-fluid mb-3"
                style={{ maxWidth: "250px" }}
              />
            )}

            <strong>Ingredients:</strong>
            <ul>
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>

            <strong>Steps:</strong>
            <ol>
              {recipe.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        ))}
    </div>
  );
}

export default MyRecipes;
