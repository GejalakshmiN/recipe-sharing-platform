import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      {/* Brand */}
      <Link className="navbar-brand fw-bold" to="/">
        🍽 Recipe App
      </Link>

      {/* Right side buttons */}
      <div className="ms-auto">
        {/* Home */}
        <Link className="btn btn-outline-light me-2" to="/">
          Home
        </Link>

        {token && (
          <>
            {/* My Recipes */}
            <Link className="btn btn-outline-light me-2" to="/my-recipes">
              My Recipes
            </Link>

            {/* Saved Recipes ✅ ADDED */}
            <Link className="btn btn-outline-info me-2" to="/saved-recipes">
              💾 Saved Recipes
            </Link>

            {/* Add Recipe */}
            <Link className="btn btn-warning me-2" to="/add-recipe">
              Add Recipe
            </Link>

            {/* Logout */}
            <button className="btn btn-danger" onClick={logout}>
              Logout
            </button>
          </>
        )}

        {!token && (
          <>
            <Link className="btn btn-outline-light me-2" to="/login">
              Login
            </Link>
            <Link className="btn btn-outline-light" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
