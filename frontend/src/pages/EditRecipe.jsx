import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";

function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);
  const [tags, setTags] = useState("");

  useEffect(() => {
    fetchRecipe();
  }, []);

  const fetchRecipe = async () => {
    try {
      const res = await axios.get(`/recipes/${id}`);
      const recipe = res.data;

      setTitle(recipe.title);
      setIngredients(recipe.ingredients?.length ? recipe.ingredients : [""]);
      setSteps(recipe.steps?.length ? recipe.steps : [""]);
      setTags(recipe.tags?.join(", ") || "");
    } catch (err) {
      alert("Failed to load recipe");
    }
  };

  // ---------------------------
  // INGREDIENT HANDLERS
  // ---------------------------
  const updateIngredient = (value, index) => {
    const copy = [...ingredients];
    copy[index] = value;
    setIngredients(copy);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  // ---------------------------
  // STEP HANDLERS
  // ---------------------------
  const updateStep = (value, index) => {
    const copy = [...steps];
    copy[index] = value;
    setSteps(copy);
  };

  const addStep = () => {
    setSteps([...steps, ""]);
  };

  const removeStep = (index) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  // ---------------------------
  // UPDATE RECIPE
  // ---------------------------
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `/recipes/${id}`,
        {
          title,
          ingredients: ingredients.filter(i => i.trim()),
          steps: steps.filter(s => s.trim()),
          tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Recipe updated successfully!");
      navigate(`/recipe/${id}`);
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Edit Recipe</h1>

      {/* TITLE */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ display: "block", marginBottom: "15px", width: "300px" }}
      />

      {/* INGREDIENTS */}
      <h3>Ingredients</h3>
      {ingredients.map((ing, index) => (
        <div key={index} style={{ marginBottom: "5px" }}>
          <input
            type="text"
            value={ing}
            onChange={(e) => updateIngredient(e.target.value, index)}
            style={{ width: "300px" }}
          />
          <button onClick={() => removeIngredient(index)}>X</button>
        </div>
      ))}
      <button onClick={addIngredient}>+ Add Ingredient</button>

      {/* STEPS */}
      <h3 style={{ marginTop: "20px" }}>Steps</h3>
      {steps.map((step, index) => (
        <div key={index} style={{ marginBottom: "5px" }}>
          <input
            type="text"
            value={step}
            onChange={(e) => updateStep(e.target.value, index)}
            style={{ width: "400px" }}
          />
          <button onClick={() => removeStep(index)}>X</button>
        </div>
      ))}
      <button onClick={addStep}>+ Add Step</button>

      {/* TAGS */}
      <h3 style={{ marginTop: "20px" }}>Tags</h3>
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="tag1, tag2"
        style={{ width: "300px" }}
      />

      {/* UPDATE */}
      <div style={{ marginTop: "25px" }}>
        <button onClick={handleUpdate}>Update Recipe</button>
      </div>
    </div>
  );
}

export default EditRecipe;
