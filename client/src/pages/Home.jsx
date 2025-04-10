import React, { useEffect, useState } from 'react';
import CocktailCard from '../components/CocktailCard';

export default function Home({ onOrder }) {
  const [cocktails, setCocktails] = useState([]);
  const [selectedCocktail, setSelectedCocktail] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/cocktails')
      .then(res => res.json())
      .then(data => setCocktails(data))
      .catch(err => console.error('Erreur fetch cocktails:', err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Menu des Cocktails</h1>
      <div className="grid grid-cols-2 gap-4">
        {cocktails.map(cocktail => (
          <CocktailCard
            key={cocktail.id}
            cocktail={cocktail}
            onSelect={setSelectedCocktail}
          />
        ))}
      </div>
      {selectedCocktail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-80">
            <h2 className="text-xl font-bold mb-2">{selectedCocktail.name}</h2>
            <ul className="mb-4">
              {selectedCocktail.ingredients.map((item, idx) => (
                <li key={idx}>• {item.quantity} {item.name}</li>
              ))}
            </ul>
            <button
              onClick={() => {
                onOrder(selectedCocktail);
                setSelectedCocktail(null);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded-xl w-full mb-2"
            >
              Commander
            </button>
            <button
              onClick={() => setSelectedCocktail(null)}
              className="text-red-500 w-full"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
