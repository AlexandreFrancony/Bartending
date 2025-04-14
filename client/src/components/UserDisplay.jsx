import { useEffect, useState } from "react";
import { FiEdit, FiMoon, FiSun } from "react-icons/fi";

export default function UserDisplay({ onNameChange }) {
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState("");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setName(storedName);
      setInput(storedName);
    } else {
      setEditing(true);
    }

    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const handleSave = () => {
    if (!input.trim()) return;
    localStorage.setItem("username", input);
    setName(input);
    setEditing(false);
    onNameChange?.(input);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 w-full text-white">
      {editing ? (
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ton prénom"
            className="px-2 py-1 text-sm rounded border border-gray-300 bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSave}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
          >
            Valider
          </button>
        </div>
      ) : (
        <>
          <span className="text-lg font-bold text-purple-400 whitespace-nowrap">
            Bienvenue, {name} 🍸
          </span>
          <button
            onClick={() => setEditing(true)}
            className="text-white hover:text-yellow-300 transition"
            aria-label="Modifier le nom"
          >
            <FiEdit />
          </button>
        </>
      )}

      <div className="ml-auto">
        <button
          onClick={toggleTheme}
          className="p-2 text-xl hover:text-yellow-300 transition"
          aria-label="Changer le thème"
        >
          {theme === "dark" ? <FiSun /> : <FiMoon />}
        </button>
      </div>
    </div>
  );
}
