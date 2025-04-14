import React, { useState, useEffect } from "react";
import defaultCocktailImg from "../assets/svg/cocktail.svg";

// Import dynamique de toutes les images du dossier
const cocktailImages = import.meta.glob("../assets/imagesCocktails/*.{jpg,png,webp}", {
  eager: true,
  import: "default"
});

export default function CocktailCard({ cocktail, onSelect }) {
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
      className="bg-white rounded-2xl shadow p-4 cursor-pointer hover:shadow-lg transition w-full"
      onClick={() => onSelect(cocktail)}
    >
      <img
        src={imageSrc}
        alt={cocktail.name}
        className="w-full h-40 object-cover rounded-xl"
      />
      <h3 className="mt-2 text-lg font-semibold text-center text-gray-800">
        {cocktail.name}
      </h3>
    </div>
  );
}
