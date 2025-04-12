import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";

export default function UserDisplay({ onNameChange }) {
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) {
      setName(stored);
      setInput(stored);
    } else {
      setEditing(true); // pas de nom → forcer l’édition
    }
  }, []);

  const handleSave = () => {
    if (!input.trim()) return;
    localStorage.setItem("username", input);
    setName(input);
    setEditing(false);
    onNameChange?.(input);
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      {editing ? (
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="px-2 py-1 rounded border text-black text-sm"
            placeholder="Ton prénom"
          />
          <button
            onClick={handleSave}
            className="text-sm bg-blue-600 text-white px-2 py-1 rounded"
          >
            Valider
          </button>
        </div>
      ) : (
        <>
          <span className="text-lg font-bold text-purple-700">Bienvenue, {name} 🍸</span>
          <button
            onClick={() => setEditing(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiEdit />
          </button>
        </>
      )}
    </div>
  );
}
