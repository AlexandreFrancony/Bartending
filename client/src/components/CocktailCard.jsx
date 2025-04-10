import React from 'react';

export default function CocktailCard({ cocktail, onSelect }) {
  return (
    <div
      className="bg-white rounded-2xl shadow p-4 cursor-pointer hover:shadow-lg transition"
      onClick={() => onSelect(cocktail)}
    >
      <img src={cocktail.image} alt={cocktail.name} className="w-full h-40 object-cover rounded-xl" />
      <h3 className="mt-2 text-lg font-semibold text-center">{cocktail.name}</h3>
    </div>
  );
}