import express from "express";
import cors from "cors";
import cocktails from "../shared/cocktails.json" assert { type: "json" };

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Données simulées
const orders = [];

let availableIngredients = [
    "Rhum blanc", "Menthe", "Sucre", "Citron vert", "Eau gazeuse", // Mojito
    "Tequila", "Jus d'orange", "Grenadine",                        // Tequila Sunrise
];

let hiddenCocktails = []; // tableau d’ID des cocktails masqués
  

// Route pour récupérer la liste des cocktails
app.get("/cocktails", (req, res) => {
  res.json(cocktails);
});

// Route pour passer une commande
app.post("/order", (req, res) => {
  const { customerName, cocktailId } = req.body;

  const cocktail = cocktails.find(c => c.id === cocktailId);
  if (!cocktail) {
    return res.status(404).json({ error: "Cocktail not found" });
  }

  const order = {
    id: Date.now(),
    customerName,
    cocktail,
    createdAt: new Date(),
  };

  orders.push(order);
  console.log(`Commande reçue : ${customerName} → ${cocktail.name}`);
  res.status(201).json({ success: true });
});

// Route pour consulter les commandes (utile pour l’admin)
app.get("/orders", (req, res) => {
  res.json(orders);
});

app.listen(PORT, () => {
  console.log(`Bartending API listening on http://localhost:${PORT}`);
});

// Obtenir les ingrédients disponibles
app.get("/admin/ingredients", (req, res) => {
    res.json(availableIngredients);
  });
  
  // Modifier les ingrédients disponibles
  app.post("/admin/ingredients", (req, res) => {
    const { ingredients } = req.body;
    availableIngredients = ingredients;
    res.json({ success: true });
  });
  
  // Obtenir les cocktails masqués
  app.get("/admin/hidden", (req, res) => {
    res.json(hiddenCocktails);
  });
  
  // Masquer ou afficher un cocktail
  app.post("/admin/hidden", (req, res) => {
    const { cocktailId, hide } = req.body;
    if (hide) {
      if (!hiddenCocktails.includes(cocktailId)) hiddenCocktails.push(cocktailId);
    } else {
      hiddenCocktails = hiddenCocktails.filter(id => id !== cocktailId);
    }
    res.json({ success: true });
  });
  
  // Route GET ingrédients disponibles
  app.get("/admin/ingredients", (req, res) => {
    res.json(availableIngredients);
  });
  
  // Route POST pour mettre à jour les ingrédients disponibles
  app.post("/admin/ingredients", (req, res) => {
    const { ingredients } = req.body;
    if (!Array.isArray(ingredients)) {
      return res.status(400).json({ error: "Invalid ingredients list" });
    }
    availableIngredients = ingredients;
    res.json({ success: true });
  });
  
  // Route GET des cocktails masqués
  app.get("/admin/hidden", (req, res) => {
    res.json(hiddenCocktails);
  });
  
  // Route POST pour cacher/afficher un cocktail
  app.post("/admin/hidden", (req, res) => {
    const { cocktailId, hide } = req.body;
  
    if (hide) {
      if (!hiddenCocktails.includes(cocktailId)) {
        hiddenCocktails.push(cocktailId);
      }
    } else {
      hiddenCocktails = hiddenCocktails.filter((id) => id !== cocktailId);
    }
  
    res.json({ success: true });
  });
  