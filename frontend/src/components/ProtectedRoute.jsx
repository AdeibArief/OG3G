import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { loading, user } = useAuth();

  console.log("loading:", loading, "user:", user);

  if (loading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!user) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;
