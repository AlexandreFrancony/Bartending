import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Welcome({ setUsername }) {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUsername(storedName); // assure la synchro immédiate
      navigate("/");
    }
  }, [navigate, setUsername]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (trimmed) {
      localStorage.setItem("username", trimmed);
      setUsername(trimmed);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-4">Bienvenue sur ma carte digitale!</h1>

      <img
        src="/assets/graph/logo.png"
        alt="Bienvenue"
        className="w-2/3 max-w-xs mb-6 rounded-xl"
      />

      <p className="mb-6">Pour commencer, entre ton prénom :</p>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Ton prénom"
        className="px-4 py-2 rounded border border-gray-300 shadow-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
      />

      <button
        onClick={handleSubmit}
        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded transition"
      >
        C'est parti !
      </button>
    </div>
  );
}
