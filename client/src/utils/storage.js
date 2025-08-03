export const getFavorites = () => {
  try {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const toggleFavorite = (id) => {
  const current = getFavorites();
  let updated;

  if (current.includes(id)) {
    updated = current.filter((fav) => fav !== id);
  } else {
    updated = [...current, id];
  }

  localStorage.setItem("favorites", JSON.stringify(updated));
  return updated;
};
