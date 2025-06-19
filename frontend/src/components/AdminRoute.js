import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Redirect to login if no token is found
    return <Navigate to="/login" />;
  }

  try {
    // Decode the JWT token to extract user information
    const base64Url = token.split(".")[1]; // Get the payload part of the JWT
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const user = JSON.parse(atob(base64)); // Decode the base64 string

    // Check if the user has the admin role
    return user && user.role === "admin" ? children : <Navigate to="/login" />;
  } catch (error) {
    console.error("Invalid token:", error);
    // Redirect to login if token decoding fails
    return <Navigate to="/login" />;
  }
};

export default AdminRoute;