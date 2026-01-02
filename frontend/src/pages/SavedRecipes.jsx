import { useEffect, useState } from "react";
import axios from "../api/axios";

function SavedRecipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios
      .get("/recipes/saved/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setRecipes(res.data))
      .catch(() => alert("Failed to load recipes"));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Saved Recipes</h2>
      {recipes.length === 0 && <p>No saved recipes</p>}
      {recipes.map((r) => (
        <h4 key={r._id}>{r.title}</h4>
      ))}
    </div>
  );
}

export default SavedRecipes;
