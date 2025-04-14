import { Link, useLocation } from "react-router-dom";

export default function BottomNav({ username, isBloster }) {
  const location = useLocation();

  if (!isBloster) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white flex justify-around items-center h-16 shadow-lg z-50">
      <Link
        to="/"
        className={`flex flex-col items-center text-sm ${
          isActive("/") ? "text-yellow-400" : "text-white"
        }`}
      >
        <span className="text-xl">🍸</span>
        Accueil
      </Link>

      <Link
        to="/orders"
        className={`flex flex-col items-center text-sm ${
          isActive("/orders") ? "text-yellow-400" : "text-white"
        }`}
      >
        <span className="text-xl">📋</span>
        Commandes
      </Link>

      <Link
        to="/admin"
        className={`flex flex-col items-center text-sm ${
          isActive("/admin") ? "text-yellow-400" : "text-white"
        }`}
      >
        <span className="text-xl">🛠</span>
        Admin
      </Link>
    </nav>
  );
}
