import { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";

export default function Admin() {
  const [cocktails, setCocktails] = useState([]);
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [hidden, setHidden] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cocktailRes, ingRes, hiddenRes] = await Promise.all([
          fetch(`${apiUrl}/cocktails`),
          fetch(`${apiUrl}/admin/ingredients`),
          fetch(`${apiUrl}/admin/hidden`),
        ]);

        const cocktailsData = await cocktailRes.json();
        const ingredients = await ingRes.json();
        const hiddenData = await hiddenRes.json();

        setCocktails(cocktailsData);
        setAvailableIngredients(ingredients);
        setHidden(hiddenData);

        const initial = {};
        cocktailsData.forEach((cocktail) => {
          cocktail.ingredients.forEach((ing) => {
            if (!initial[ing.category]) {
              initial[ing.category] = false;
            }
          });
        });
        setExpandedCategories(initial);
      } catch (err) {
        console.error("Erreur fetch données admin:", err);
      }
    };

    fetchData();
  }, [apiUrl]);

  const toggleCocktailVisibility = async (cocktailId, isHidden) => {
    try {
      const res = await fetch(`${apiUrl}/admin/hidden`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cocktailId, hide: !isHidden }),
      });

      if (res.ok) {
        setHidden((prev) =>
          isHidden ? prev.filter((id) => id !== cocktailId) : [...prev, cocktailId]
        );
      }
    } catch (err) {
      console.error("Erreur toggle visibility:", err);
    }
  };

  const toggleIngredient = async (ingredient) => {
    const updated = availableIngredients.includes(ingredient)
      ? availableIngredients.filter((i) => i !== ingredient)
      : [...availableIngredients, ingredient];

    setAvailableIngredients(updated);

    try {
      await fetch(`${apiUrl}/admin/ingredients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: updated }),
      });
    } catch (err) {
      console.error("Erreur update ingrédients:", err);
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const ingredientByCategory = {};
  cocktails.forEach((cocktail) => {
    cocktail.ingredients.forEach((ing) => {
      if (!ingredientByCategory[ing.category]) {
        ingredientByCategory[ing.category] = new Set();
      }
      ingredientByCategory[ing.category].add(ing.name);
    });
  });

  const isCocktailFeasible = (cocktail) =>
    cocktail.ingredients.every((ing) =>
      availableIngredients.includes(ing.name)
    );

  return (
    <PageWrapper>
      <div className="p-6 text-gray-900 dark:text-gray-100">
        <h1 className="text-3xl font-bold mb-6">👨‍🍳 Interface Admin</h1>

        {/* Ingrédients par catégories */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold mb-4">Ingrédients disponibles</h2>

            <div className="mb-4">
              <button
                onClick={() => {
                  const allIngredients = Object.values(ingredientByCategory)
                    .flatMap((set) => Array.from(set));
                  setAvailableIngredients(allIngredients);
                  try {
                    fetch(`${apiUrl}/admin/ingredients`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ ingredients: allIngredients }),
                    });
                  } catch (err) {
                    console.error("Erreur lors de la sélection de tous les ingrédients:", err);
                  }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
              >
                Tous
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {Object.entries(ingredientByCategory).map(([category, ingredientsSet]) => {
              const ingredients = Array.from(ingredientsSet);

              return (
                <div
                  key={category}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm"
                >
                  <button
                    className="w-full text-left px-4 py-2 font-semibold text-purple-700 dark:text-purple-300 flex justify-between items-center"
                    onClick={() => toggleCategory(category)}
                  >
                    <span>{category}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      {expandedCategories[category] ? "▲" : "▼"}
                    </span>
                  </button>

                  {expandedCategories[category] && (
                    <div className="px-4 pb-4 pt-2 flex flex-wrap gap-3">
                      {ingredients.map((ingredient) => (
                        <label
                          key={ingredient}
                          className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-100"
                        >
                          <input
                            type="checkbox"
                            checked={availableIngredients.includes(ingredient)}
                            onChange={() => toggleIngredient(ingredient)}
                            className="accent-purple-600"
                          />
                          {ingredient}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Cocktails */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Cocktails</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
            {cocktails.map((cocktail) => {
              const isHidden = hidden.includes(cocktail.id);
              const isFeasible = isCocktailFeasible(cocktail);

              return (
                <div
                  key={cocktail.id}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl p-4 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                      {cocktail.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {isHidden ? "❌ Caché" : "✅ Visible"}
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        isFeasible ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {isFeasible ? "✔ Réalisable" : "✘ Ingrédients manquants"}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleCocktailVisibility(cocktail.id, isHidden)}
                    className={`mt-4 px-4 py-2 rounded text-white text-sm font-medium ${
                      isHidden
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    } transition`}
                  >
                    {isHidden ? "Afficher" : "Cacher"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
