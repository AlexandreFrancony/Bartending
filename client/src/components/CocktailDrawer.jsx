import React from "react";
import defaultImage from "../assets/svg/cocktail.svg";

export default function CocktailDrawer({ cocktail, onClose, onOrder }) {
  if (!cocktail) return null;

  const username = localStorage.getItem("username");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Fond sombre avec blur */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer principal */}
      <div
        className="relative bg-white w-full max-h-[90dvh] rounded-t-3xl p-6 pb-8 shadow-lg overflow-y-auto z-50 animate-slideUp"
        style={{
          paddingBottom:
            username === "Bloster"
              ? "6rem"
              : "calc(env(safe-area-inset-bottom) + 1.5rem)",
        }}
      >
        {/* Titre */}
        <h2 className="text-2xl font-bold mb-4 text-center text-black">{cocktail.name}</h2>

        {/* Ingrédients */}
        <h3 className="text-lg font-semibold mb-2">Ingrédients :</h3>
        <ul className="list-disc list-inside text-gray-700 mb-6">
          {cocktail.ingredients.map((ing, i) => (
            <li key={i}>
              {ing.name} - {ing.quantity}
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex justify-between">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold"
            onClick={onClose}
          >
            Fermer
          </button>

          <button
            className="bg-purple-700 text-white px-4 py-2 rounded font-semibold"
            onClick={() => onOrder(cocktail)}
          >
            Commander 🍹
          </button>
        </div>
      </div>
    </div>
  );
}
