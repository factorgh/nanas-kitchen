import { message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  // Initial states for the login form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Dummy admin credentials
  const adminCredentials = {
    username: "admin",
    password: "admin",
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation logic for username and password
    if (
      username === adminCredentials.username &&
      password === adminCredentials.password
    ) {
      setIsAuthenticated(true);
      // Set loggedIn state to true in the local storage
      localStorage.setItem("isLoggedIn", true);
      navigate("/admin/dashboard");
      message.success("Logged in successfully");
      setError("");
    } else {
      setError("Invalid username or password.");
      message.error("Invalid username or password.");
      setIsAuthenticated(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white shadow-md p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>

        {/* Error message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 mb-4 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mb-4 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded mt-4"
          >
            Login
          </button>
        </form>

        {/* Success message after login */}
        {isAuthenticated && (
          <p className="text-green-500 text-center mt-4">Welcome, Admin!</p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
