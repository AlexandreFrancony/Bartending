import { useEffect, useState } from "react";
import CocktailCard from "../components/CocktailCard";
import PageWrapper from "../components/PageWrapper";
import UserDisplay from "../components/UserDisplay";
import CocktailDrawer from "../components/CocktailDrawer";
import toast from "react-hot-toast";

export default function Home() {
  const [cocktails, setCocktails] = useState([]);
  const [username, setUsername] = useState("");
  const [selectedCocktail, setSelectedCocktail] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCocktails = async () => {
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
      }
    };

    fetchCocktails();
  }, []);

  const handleCocktailClick = (cocktail) => {
    setSelectedCocktail(cocktail);
  };

  const handleOrder = async (cocktail) => {
    const apiUrl = import.meta.env.VITE_API_URL;
  
    try {
      const res = await fetch(`${apiUrl}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: username,
          cocktailId: cocktail.id,
        }),
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
  
  

  return (
    <PageWrapper>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white px-4 pt-[calc(env(safe-area-inset-top)+0.5rem)] pb-3 shadow-md w-full">
        <UserDisplay onNameChange={setUsername} />
      </header>

      {/* Contenu */}
      <div className="pt-20 pb-20 px-4">

        {/* Grille des cocktails */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {cocktails.map((cocktail) => (
            <CocktailCard
              key={cocktail.id}
              cocktail={cocktail}
              onSelect={handleCocktailClick}
            />
          ))}
        </div>

          {cocktails.length === 0 && (
            <p className="text-center text-gray-600 w-full mt-6">
              Aucun cocktail disponible pour le moment 🥲
            </p>
          )}
        </div>

      {/* Drawer détails cocktail */}
      <CocktailDrawer
        cocktail={selectedCocktail}
        onClose={() => setSelectedCocktail(null)}
        onOrder={handleOrder}
      />
    </PageWrapper>
  );
}
