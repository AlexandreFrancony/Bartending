import React, { useState } from 'react';
import defaultCocktailImg from '../assets/svg/cocktail.svg';

export default function CocktailCard({ cocktail, onSelect }) {
  const [imgError, setImgError] = useState(false);

  const imageToShow = !imgError && cocktail.image?.trim()
    ? cocktail.image
    : defaultCocktailImg;

  return (
    <div
    className="bg-white rounded-2xl shadow p-4 cursor-pointer hover:shadow-lg transition w-full"
      onClick={() => onSelect(cocktail)}
    >
      <img
        src={imageToShow}
        onError={() => setImgError(true)}
        alt={cocktail.name}
        className="w-full h-40 object-cover rounded-xl"
      />
      <h3 className="mt-2 text-lg font-semibold text-center text-gray-800">
        {cocktail.name}
      </h3>
    </div>
  );
}