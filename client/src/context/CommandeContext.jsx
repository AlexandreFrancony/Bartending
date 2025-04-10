import { createContext, useState, useContext } from "react";

const CommandeContext = createContext();

export function useCommande() {
  return useContext(CommandeContext);
}

export function CommandeProvider({ children }) {
  const [commandes, setCommandes] = useState([]);

  const ajouterCommande = (cocktail, client) => {
    setCommandes((prev) => [...prev, { cocktail, client }]);
  };

  return (
    <CommandeContext.Provider value={{ commandes, ajouterCommande }}>
      {children}
    </CommandeContext.Provider>
  );
}
