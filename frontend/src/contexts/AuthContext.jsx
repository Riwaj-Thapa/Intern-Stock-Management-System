import { createContext, useContext, useState } from "react"; // React imports for context and state management
import { useNavigate } from "react-router-dom"; // React Router hook for navigation
import * as api from "../services/api"; // Importing API services

// Create a context for authentication
const AuthContext = createContext(null);

// Authentication provider component to wrap the application
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // State to store the current user
  const navigate = useNavigate(); // Navigation function from React Router

  // Function to handle user login

  const login = async (email, password) => {
    try {
      // Call API to authenticate the user
      const { token, user } = await api.login(email, password);

      // Ensure token and user details are present
      if (!token || !user) {
        throw new Error(
          "Invalid login response: Missing token or user details"
        );
      }

      // Update user state (assuming you're using useState for managing the user state)
      setUser(user);

      // Store token in local storage for subsequent API requests
      localStorage.setItem("token", token);

      // Redirect user based on their role
      const redirectPath =
        user.role === "admin" ? "/admin/dashboard" : "/employee/dashboard";

      // Redirect using the navigate function
      navigate(redirectPath);
    } catch (error) {
      console.error("Login error:", error); // Log errors for debugging

      // Show a user-friendly error message
      alert("Login failed. Please check your credentials and try again.");

      // Optionally, rethrow the error for further handling
      throw error;
    }
  };

  // Function to handle user logout
  const logout = async () => {
    try {
      await api.logout(); // Call API to perform logout
      setUser(null); // Clear user state
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout error:", error); // Log errors for debugging
    }
  };

  // Provide authentication context to child components
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to access authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Ensure the hook is used within an AuthProvider
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context; // Return the context value
};
