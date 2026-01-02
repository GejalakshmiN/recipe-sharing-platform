import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

function AddRecipe() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const uploadImage = async () => {
    if (!image) return "";

    const data = new FormData();
    data.append("image", image);

    const res = await axios.post("/upload/image", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.imageUrl;
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Login required");

      const imageUrl = await uploadImage();

      await axios.post(
        "/recipes",
        {
          title,
          ingredients: ingredients.filter(Boolean),
          steps: steps.filter(Boolean),
          tags: tags.split(",").map(t => t.trim()),
          image: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 REQUIRED
          },
        }
      );

      alert("Recipe added!");
      navigate("/my-recipes");
    } catch (err) {
      alert("Failed to add recipe");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Add Recipe</h1>

      <input
        placeholder="Recipe title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          setImage(e.target.files[0]);
          setPreview(URL.createObjectURL(e.target.files[0]));
        }}
      />

      {preview && <img src={preview} width="150" alt="preview" />}

      <h3>Ingredients</h3>
      {ingredients.map((ing, i) => (
        <input
          key={i}
          value={ing}
          onChange={(e) => {
            const copy = [...ingredients];
            copy[i] = e.target.value;
            setIngredients(copy);
          }}
        />
      ))}
      <button onClick={() => setIngredients([...ingredients, ""])}>+ Add</button>

      <h3>Steps</h3>
      {steps.map((step, i) => (
        <input
          key={i}
          value={step}
          onChange={(e) => {
            const copy = [...steps];
            copy[i] = e.target.value;
            setSteps(copy);
          }}
        />
      ))}
      <button onClick={() => setSteps([...steps, ""])}>+ Add</button>

      <h3>Tags</h3>
      <input
        placeholder="idly, south-indian"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <br /><br />
      <button onClick={handleSubmit}>Save Recipe</button>
    </div>
  );
}

export default AddRecipe;
