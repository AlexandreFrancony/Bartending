import { useEffect, useState } from "react";

export default function Admin() {
  const [cocktails, setCocktails] = useState([]);
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [hidden, setHidden] = useState([]);

  // Fetch cocktails, ingrédients et hidden au chargement
  useEffect(() => {
    const fetchData = async () => {
      const [cocktailRes, ingRes, hiddenRes] = await Promise.all([
        fetch("http://localhost:3001/cocktails"),
        fetch("http://localhost:3001/admin/ingredients"),
        fetch("http://localhost:3001/admin/hidden"),
      ]);

      setCocktails(await cocktailRes.json());
      setAvailableIngredients(await ingRes.json());
      setHidden(await hiddenRes.json());
    };

    fetchData();
  }, []);

  const toggleCocktailVisibility = async (cocktailId, isHidden) => {
    const res = await fetch("http://localhost:3001/admin/hidden", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cocktailId, hide: !isHidden }),
    });

    if (res.ok) {
      setHidden((prev) =>
        isHidden ? prev.filter((id) => id !== cocktailId) : [...prev, cocktailId]
      );
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

    await fetch("http://localhost:3001/admin/ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients: updated }),
    });
  };

  // Liste d’ingrédients unique à partir des cocktails
  const allIngredients = Array.from(
    new Set(cocktails.flatMap((c) => c.ingredients.map((i) => i.name)))
  );

  const isCocktailFeasible = (cocktail) => {
    return cocktail.ingredients.every((ing) =>
      availableIngredients.includes(ing.name)
    );
  };

  return (
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
  );
}
