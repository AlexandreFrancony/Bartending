import { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";

export default function Admin() {
  const [cocktails, setCocktails] = useState([]);
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [hidden, setHidden] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cocktailRes, ingRes, hiddenRes] = await Promise.all([
          fetch(`${apiUrl}/cocktails`),
          fetch(`${apiUrl}/admin/ingredients`),
          fetch(`${apiUrl}/admin/hidden`),
        ]);

        setCocktails(await cocktailRes.json());
        setAvailableIngredients(await ingRes.json());
        setHidden(await hiddenRes.json());
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
      } else {
        console.error("Erreur lors du POST /admin/hidden");
      }
    } catch (err) {
      console.error("Erreur toggle visibility:", err);
    }
  };

  const toggleIngredient = async (ingredient) => {
    let updated = [...availableIngredients];
    if (availableIngredients.includes(ingredient)) {
      updated = updated.filter((i) => i !== ingredient);
    } else {
      updated.push(ingredient);
    }

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

  const allIngredients = Array.from(
    new Set(cocktails.flatMap((c) => c.ingredients.map((i) => i.name)))
  );

  const isCocktailFeasible = (cocktail) => {
    return cocktail.ingredients.every((ing) =>
      availableIngredients.includes(ing.name)
    );
  };

  return (
    <PageWrapper>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">👨‍🍳 Interface Admin</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Ingrédients disponibles</h2>
          <div className="flex flex-wrap gap-4">
            {allIngredients.map((ingredient) => (
              <label key={ingredient} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={availableIngredients.includes(ingredient)}
                  onChange={() => toggleIngredient(ingredient)}
                />
                {ingredient}
              </label>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Cocktails</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cocktails.map((cocktail) => {
              const isHidden = hidden.includes(cocktail.id);
              const isFeasible = isCocktailFeasible(cocktail);

              return (
                <div
                  key={cocktail.id}
                  className="border rounded-xl p-4 shadow bg-white flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-bold text-black">{cocktail.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">
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
                    className={`mt-4 px-4 py-1 rounded text-white ${
                      isHidden ? "bg-green-500" : "bg-red-500"
                    }`}
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
