import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";

function ViewRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [recipe, setRecipe] = useState(null);
  const [comment, setComment] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    fetchRecipe();
  }, []);

  const fetchRecipe = async () => {
    try {
      const res = await axios.get(`/recipes/${id}`);
      setRecipe(res.data);

      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.id === res.data.createdBy) {
          setIsOwner(true);
        }
      }
    } catch {
      alert("Failed to load recipe");
    }
  };

  const likeRecipe = async () => {
    await axios.post(
      `/recipes/${id}/like`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchRecipe();
  };

  const saveRecipe = async () => {
    await axios.post(
      `/recipes/${id}/save`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Saved!");
  };

  const addComment = async () => {
    if (!comment.trim()) return;

    await axios.post(
      `/recipes/${id}/comment`,
      { text: comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setComment("");
    fetchRecipe();
  };

  const deleteRecipe = async () => {
    if (!window.confirm("Delete this recipe?")) return;

    await axios.delete(`/recipes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    navigate("/my-recipes");
  };

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>{recipe.title}</h2>

      {recipe.image && (
        <img src={recipe.image} alt="" className="img-fluid mb-3" />
      )}

      {token && (
        <div className="mb-3">
          <button className="btn btn-outline-danger me-2" onClick={likeRecipe}>
            ❤️ {recipe.likes.length}
          </button>
          <button className="btn btn-outline-primary" onClick={saveRecipe}>
            💾 Save
          </button>
        </div>
      )}

      <h5>Ingredients</h5>
      <ul className="list-group mb-3">
        {recipe.ingredients.map((i, idx) => (
          <li key={idx} className="list-group-item">{i}</li>
        ))}
      </ul>

      <h5>Steps</h5>
      <ol className="list-group list-group-numbered mb-3">
        {recipe.steps.map((s, idx) => (
          <li key={idx} className="list-group-item">{s}</li>
        ))}
      </ol>

      {isOwner && (
        <div className="mb-3">
          <button
            className="btn btn-primary me-2"
            onClick={() => navigate(`/edit-recipe/${id}`)}
          >
            Edit
          </button>
          <button className="btn btn-danger" onClick={deleteRecipe}>
            Delete
          </button>
        </div>
      )}

      <h5>Comments</h5>
      {recipe.comments.map((c, idx) => (
        <div key={idx} className="border p-2 mb-2">
          <strong>{c.user?.name || "User"}</strong>
          <p className="mb-0">{c.text}</p>
        </div>
      ))}

      {token && (
        <>
          <input
            className="form-control mt-2"
            placeholder="Add comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="btn btn-success mt-2" onClick={addComment}>
            Comment
          </button>
        </>
      )}
    </div>
  );
}

export default ViewRecipe;
