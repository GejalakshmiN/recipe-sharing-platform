import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await axios.get("/recipes");
      setRecipes(res.data);
    } catch (err) {
      alert("Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SEARCH FILTER LOGIC
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(search.toLowerCase()) ||
    recipe.tags?.some(tag =>
      tag.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="container mt-4">
      {/* 🔍 SEARCH BAR */}
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary">
          Search
        </button>
      </div>

      {loading && <p>Loading recipes...</p>}

      {!loading && filteredRecipes.length === 0 && (
        <p>No recipes found.</p>
      )}

      {/* 🧾 RECIPE CARDS */}
      <div className="row">
        {filteredRecipes.map((recipe) => (
          <div key={recipe._id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              {recipe.image && (
                <img
                  src={recipe.image}
                  className="card-img-top"
                  alt={recipe.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}

              <div className="card-body">
                <h5 className="card-title">{recipe.title}</h5>

                <Link
                  to={`/recipe/${recipe._id}`}
                  className="btn btn-primary btn-sm"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
