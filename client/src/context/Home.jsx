import { useEffect, useState } from "react";
import CocktailCard from "../components/CocktailCard";
import UsernameModal from "../components/UsernameModal";

export default function Home() {
  const [cocktails, setCocktails] = useState([]);
  const [username, setUsername] = useState("");

  // Récupère les cocktails depuis l'API
  useEffect(() => {
    const fetchCocktails = async () => {
      try {
        const res = await fetch("http://localhost:3001/cocktails");
        const data = await res.json();
        setCocktails(data);
      } catch (err) {
        console.error("Erreur lors du fetch des cocktails :", err);
      }
    };

    fetchCocktails();
  }, []);

  const handleCocktailClick = async (cocktail) => {
    const confirmed = confirm(`Commander un ${cocktail.name} ?`);
    if (!confirmed) return;

    try {
      const res = await fetch("http://localhost:3001/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: username,
          cocktailId: cocktail.id,
        }),
      });

      if (res.ok) {
        alert(`🍹 ${cocktail.name} commandé avec succès !`);
      } else {
        alert("Erreur lors de la commande.");
      }
    } catch (err) {
      console.error(err);
      alert("Impossible de contacter le serveur.");
    }
  };

  return (
    <div className="p-4">
      <UsernameModal onNameSet={setUsername} />
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold">Bienvenue {username} 🍸</h1>
        <p className="text-gray-600">Choisis ton cocktail :</p>
      </header>

      <div className="flex flex-wrap justify-center">
        {cocktails.map((cocktail) => (
          <CocktailCard
            key={cocktail.id}
            cocktail={cocktail}
            onClick={handleCocktailClick}
          />
        ))}
      </div>
    </div>
  );
}
