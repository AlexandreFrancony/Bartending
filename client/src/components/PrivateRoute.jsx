import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const username = localStorage.getItem("username");

  if (username !== "Bloster") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
