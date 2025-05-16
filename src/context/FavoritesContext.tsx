/**
 * Unit Tests for FavoritesContext:
 * 
 * 1. State Management Tests:
 *    - Should initialize with empty favorites array
 *    - Should load saved favorites from AsyncStorage
 *    - Should handle AsyncStorage errors gracefully
 * 
 * 2. Favorite Operations Tests:
 *    - Should add image to favorites
 *    - Should remove image from favorites
 *    - Should toggle favorite status correctly
 *    - Should persist changes to AsyncStorage
 * 
 * 3. Context Usage Tests:
 *    - Should throw error when used outside provider
 *    - Should provide correct values to consumers
 * 
 * 4. Integration Tests:
 *    - Should maintain favorites across navigation
 *    - Should update UI when favorites change
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FavoritesContextType = {
  favorites: string[];
  toggleFavorite: (imageUrl: string) => void;
  isFavorite: (imageUrl: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const toggleFavorite = async (imageUrl: string) => {
    try {
      const newFavorites = favorites.includes(imageUrl)
        ? favorites.filter((url) => url !== imageUrl)
        : [...favorites, imageUrl];

      setFavorites(newFavorites);
      await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  };

  const isFavorite = (imageUrl: string) => favorites.includes(imageUrl);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
