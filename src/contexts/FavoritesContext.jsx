// contexts/FavoritesContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favoritesProducts, setFavoritesProducts] = useState([]);

  // Yüklə
  const loadFavorites = () => {
    const data = JSON.parse(localStorage.getItem("favoritesProducts")) || [];
    setFavoritesProducts(data);
  };

  // Əlavə et
  const addToFavorites = (product) => {
    setFavoritesProducts((prev) => {
      const updated = [...prev, product];
      localStorage.setItem("favoritesProducts", JSON.stringify(updated));
      window.dispatchEvent(new Event("favoritesUpdated")); // Bütün yerlərdə eyni olsun
      return updated;
    });
  };

  // Sil
  const removeFromFavorites = (id) => {
    setFavoritesProducts((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem("favoritesProducts", JSON.stringify(updated));
      window.dispatchEvent(new Event("favoritesUpdated"));
      return updated;
    });
  };

  // Təmizlə
  const clearFavorites = () => {
    localStorage.removeItem("favoritesProducts");
    setFavoritesProducts([]);
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  // Yüklə və event dinlə
  useEffect(() => {
    loadFavorites(); // localStorage-dan yüklə
    const handleUpdate = () => loadFavorites(); // Yenidən yüklə
    window.addEventListener("favoritesUpdated", handleUpdate);
    return () => window.removeEventListener("favoritesUpdated", handleUpdate);
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favoritesProducts,
        addToFavorites,
        removeFromFavorites,
        clearFavorites,
        loadFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext;