import express from "express";
import cors from "cors";
import cocktails from "../shared/cocktails.json" assert { type: "json" };
import os from "os";

const app = express();
const PORT = 3001;

app.use(cors()); // ✅ autorise toutes les origines
app.use(express.json());

// Données simulées
const orders = [];

let availableIngredients = [
  "Rhum blanc", "Menthe", "Sucre", "Citron vert", "Eau gazeuse", // Mojito
  "Tequila", "Jus d'orange", "Grenadine",                        // Tequila Sunrise
];

let hiddenCocktails = [];

// 🥂 ROUTES

// Récupérer tous les cocktails
app.get("/cocktails", (req, res) => {
  res.json(cocktails);
});

// Passer une commande
app.post("/order", (req, res) => {
  const { customerName, cocktailId } = req.body;

  const cocktail = cocktails.find((c) => c.id === cocktailId);
  if (!cocktail) return res.status(404).json({ error: "Cocktail not found" });

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

// Récupérer les commandes
app.get("/orders", (req, res) => {
  res.json(orders);
});

// 🔧 ADMIN : ingrédients disponibles
app.get("/admin/ingredients", (req, res) => {
  res.json(availableIngredients);
});

app.post("/admin/ingredients", (req, res) => {
  const { ingredients } = req.body;
  if (!Array.isArray(ingredients)) {
    return res.status(400).json({ error: "Invalid ingredients list" });
  }
  availableIngredients = ingredients;
  res.json({ success: true });
});

// 🔧 ADMIN : cocktails masqués
app.get("/admin/hidden", (req, res) => {
  res.json(hiddenCocktails);
});

app.post("/admin/hidden", (req, res) => {
  const { cocktailId, hide } = req.body;
  if (!cocktailId) return res.status(400).json({ error: "Missing cocktailId" });

  if (hide) {
    if (!hiddenCocktails.includes(cocktailId)) hiddenCocktails.push(cocktailId);
  } else {
    hiddenCocktails = hiddenCocktails.filter((id) => id !== cocktailId);
  }

  res.json({ success: true });
});

app.delete("/orders/:id", (req, res) => {
  const { id } = req.params;
  const orderId = parseInt(id);

  const index = orders.findIndex((order) => order.id === orderId);
  if (index === -1) {
    return res.status(404).json({ error: "Commande non trouvée" });
  }

  orders.splice(index, 1);
  res.json({ success: true });
});

app.delete("/orders", (req, res) => {
  orders.length = 0; // vide le tableau
  res.json({ success: true });
});

function getLocalExternalIp() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }

  return "localhost"; // fallback
}

const address = getLocalExternalIp();

// ✅ Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Bartending API listening on http://${address}:${PORT}`);
});
