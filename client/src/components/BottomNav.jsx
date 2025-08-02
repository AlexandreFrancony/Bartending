import { Link, useLocation } from "react-router-dom";

export default function BottomNav({ username, isBloster }) {
  const location = useLocation();

  if (!isBloster) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex justify-around items-center h-16 shadow-lg z-50 transition-colors duration-300">
      <Link
        to="/"
        className={`flex flex-col items-center text-sm ${
          isActive("/") ? "text-yellow-500 dark:text-yellow-300" : ""
        }`}
      >
        <span className="text-xl">🍸</span>
        Accueil
      </Link>

      <Link
        to="/orders"
        className={`flex flex-col items-center text-sm ${
          isActive("/orders") ? "text-yellow-500 dark:text-yellow-300" : ""
        }`}
      >
        <span className="text-xl">📋</span>
        Commandes
      </Link>

      <Link
        to="/admin"
        className={`flex flex-col items-center text-sm ${
          isActive("/admin") ? "text-yellow-500 dark:text-yellow-300" : ""
        }`}
      >
        <span className="text-xl">🛠</span>
        Admin
      </Link>
    </nav>
  );
}
