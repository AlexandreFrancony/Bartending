import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Orders from "./pages/Orders";
import NotAuthorized from "./pages/NotAuthorized";
import PrivateRoute from "./components/PrivateRoute";
import BottomNav from "./components/BottomNav";
import { useEffect, useState } from "react";
import Welcome from "./pages/Welcome";

function AppRoutes({ username, setUsername, isBloster }) {
  const location = useLocation();

  if (!username && location.pathname !== "/welcome") {
    return <Navigate to="/welcome" replace />;
  }

  return (
    <>
      <div className={isBloster ? "pb-20" : ""}>
        <Routes>
          <Route
            path="/"
            element={<Home username={username} setUsername={setUsername} />}
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />
          <Route path="/unauthorized" element={<NotAuthorized />} />
          <Route
            path="/welcome"
            element={<Welcome setUsername={setUsername} />}
          />
        </Routes>
      </div>

      <BottomNav username={username} isBloster={isBloster} />
    </>
  );
}

export default function App() {
  const [username, setUsername] = useState("");
  const [isBloster, setIsBloster] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) {
      setUsername(stored);
      setIsBloster(stored.toLowerCase() === "bloster");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsBloster(username.toLowerCase() === "bloster");
  }, [username]);

  if (isLoading) return null;

  return (
    <Router>
      <AppRoutes username={username} setUsername={setUsername} isBloster={isBloster} />
    </Router>
  );
}
