import React, { useState, useEffect } from "react";
import defaultCocktailImg from "../assets/svg/cocktail.svg";

// Import dynamique de toutes les images du dossier
const cocktailImages = import.meta.glob("../assets/imagesCocktails/*.{jpg,png,webp}", {
  eager: true,
  import: "default"
});

export default function CocktailCard({ cocktail, onSelect, isFavorite, onToggleFavorite }) {
  const [imageSrc, setImageSrc] = useState(defaultCocktailImg);

  useEffect(() => {
    if (cocktail.image && cocktailImages[`../assets/imagesCocktails/${cocktail.image}`]) {
      setImageSrc(cocktailImages[`../assets/imagesCocktails/${cocktail.image}`]);
    } else {
      setImageSrc(defaultCocktailImg);
    }
  }, [cocktail.image]);

  return (
    <div
      className="bg-white rounded-2xl shadow p-4 cursor-pointer hover:shadow-lg transition w-full relative"
      onClick={() => onSelect(cocktail)}
    >
      <img
        src={imageSrc}
        alt={cocktail.name}
        className="w-full h-40 object-cover rounded-xl"
      />
      <h3 className="mt-2 text-lg font-semibold text-gray-800 h-[3.5rem] flex items-center justify-center text-ellipsis overflow-hidden text-center text-wrap">
        {cocktail.name}
      </h3>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className={`absolute top-4 right-5 text-xl ${
          isFavorite ? "text-red-500" : "text-gray-400"
        }`}
        aria-label={`Favori ${cocktail.name}`}
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>
    </div>
  );
}
