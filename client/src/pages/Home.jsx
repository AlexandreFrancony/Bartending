import { useEffect, useState } from "react";
import CocktailCard from "../components/CocktailCard";
import PageWrapper from "../components/PageWrapper";
import UserDisplay from "../components/UserDisplay";
import CocktailDrawer from "../components/CocktailDrawer";
import toast from "react-hot-toast";
import { getFavorites, toggleFavorite } from "../utils/storage";

export default function Home({ username, setUsername }) {
  const [cocktails, setCocktails] = useState([]);
  const [selectedCocktail, setSelectedCocktail] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  useEffect(() => {
    const fetchCocktails = async () => {
      setIsLoading(true); // 👈 début du chargement
      try {
        const [cocktailRes, ingRes, hiddenRes] = await Promise.all([
          fetch(`${apiUrl}/cocktails`),
          fetch(`${apiUrl}/admin/ingredients`),
          fetch(`${apiUrl}/admin/hidden`),
        ]);

        const cocktails = await cocktailRes.json();
        const availableIngredients = await ingRes.json();
        const hiddenCocktails = await hiddenRes.json();

        const filtered = cocktails.filter((cocktail) => {
          const isVisible = !hiddenCocktails.includes(cocktail.id);
          const hasAllIngredients = cocktail.ingredients.every((ing) =>
            availableIngredients.includes(ing.name)
          );
          return isVisible && hasAllIngredients;
        });

        setCocktails(filtered);
      } catch (err) {
        console.error("Erreur lors du fetch des données :", err);
      } finally {
        setIsLoading(false); // 👈 fin du chargement
      }
    };

    fetchCocktails();
  }, []);

  const handleCocktailClick = (cocktail) => {
    setSelectedCocktail(cocktail);
  };

  const handleOrder = async (cocktail) => {
    try {
      const res = await fetch(`${apiUrl}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: username,
          cocktailId: cocktail.id
        })
      });

      if (res.ok) {
        toast.success(`🍹 ${cocktail.name} commandé avec succès !`);
        setSelectedCocktail(null);
      } else {
        toast.error("Erreur lors de la commande.");
      }
    } catch (err) {
      console.error("Erreur commande :", err);
      toast.error("Impossible de contacter le serveur.");
    }
  };

  const toggleFav = (id) => {
    const updated = toggleFavorite(id);
    setFavorites(updated);
  };

  const hasAlcohol = (cocktail) =>
    cocktail.ingredients.some((ing) => ing.category === "Alcool");

  const filteredCocktails = cocktails
    .filter((cocktail) =>
      cocktail.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((cocktail) => {
      if (filterType === "all") return true;
      if (filterType === "alcohol") return hasAlcohol(cocktail);
      if (filterType === "noalcohol") return !hasAlcohol(cocktail);
      return true;
    });

  const favoritesList = filteredCocktails.filter((c) => favorites.includes(c.id));
  const othersList = filteredCocktails.filter((c) => !favorites.includes(c.id));

  return (
    <PageWrapper>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 pt-[calc(env(safe-area-inset-top)+0.5rem)] pb-3 shadow-md w-full transition-colors duration-300">
        <UserDisplay onNameChange={setUsername} />
      </header>

      <div className="pt-[calc(env(safe-area-inset-top)+5.3rem)] px-4">
        <input
          type="text"
          placeholder="🔎 Rechercher un cocktail..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-4 p-2 border rounded text-sm shadow-sm"
        />

        <div className="flex justify-center mb-4 gap-2">
          {["alcohol", "all", "noalcohol"].map((type) => (
            <button
              key={type}
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                filterType === type ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setFilterType(type)}
            >
              {type === "alcohol" && "🥃 Alcoolisés"}
              {type === "all" && "🍹 Tous"}
              {type === "noalcohol" && "🧃 Sans Alcool"}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500 mt-6" aria-live="polite">Chargement des cocktails...</p>
        ) : filteredCocktails.length === 0 ? (
          <p className="text-center text-gray-600 w-full mt-6">
            Aucun cocktail trouvé 🥲
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {[...favoritesList, ...othersList].map((cocktail) => (
              <div key={cocktail.id || cocktail.name} className="relative">
                <CocktailCard
                  cocktail={cocktail}
                  onSelect={handleCocktailClick}
                  isFavorite={favorites.includes(cocktail.id)}
                  onToggleFavorite={() => toggleFav(cocktail.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <CocktailDrawer
        cocktail={selectedCocktail}
        onClose={() => setSelectedCocktail(null)}
        onOrder={handleOrder}
      />
    </PageWrapper>
  );
}
