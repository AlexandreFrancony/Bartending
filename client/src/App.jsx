import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import NotAuthorized from "./pages/NotAuthorized";
import PrivateRoute from "./components/PrivateRoute";
import BottomNav from "./components/BottomNav";
import { useEffect, useState } from "react";

export default function App() {
  const [username, setUsername] = useState("");
  const [isBloster, setIsBloster] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) {
      setUsername(stored);
      setIsBloster(stored.toLowerCase() === "bloster");
    }
  }, []);

  useEffect(() => {
    setIsBloster(username.toLowerCase() === "bloster");
  }, [username]);

  return (
    <Router>
      <div className="pb-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route path="/unauthorized" element={<NotAuthorized />} />
        </Routes>
      </div>

      <BottomNav username={username} isBloster={isBloster} />
    </Router>
  );
}
