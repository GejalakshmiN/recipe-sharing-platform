import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import MyRecipes from "./pages/MyRecipes";
import AddRecipe from "./pages/AddRecipe";
import ViewRecipe from "./pages/ViewRecipe";
import EditRecipe from "./pages/EditRecipe";
import SavedRecipes from "./pages/SavedRecipes";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recipe/:id" element={<ViewRecipe />} />

        {/* Protected routes */}
        <Route
          path="/my-recipes"
          element={
            <ProtectedRoute>
              <MyRecipes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-recipe"
          element={
            <ProtectedRoute>
              <AddRecipe />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved-recipes"
          element={
            <ProtectedRoute>
              <SavedRecipes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-recipe/:id"
          element={
            <ProtectedRoute>
              <EditRecipe />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
