import { useState, useEffect } from "react";

export default function UsernameModal({ onNameSet }) {
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (!storedName) {
      setShowModal(true);
    } else {
      setName(storedName);
      onNameSet(storedName);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("username", name);
    onNameSet(name);
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-11/12 max-w-sm shadow-xl">
        <h2 className="text-lg font-bold mb-4">Ton prénom ?</h2>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          onClick={handleSave}
        >
          Valider
        </button>
      </div>
    </div>
  );
}
