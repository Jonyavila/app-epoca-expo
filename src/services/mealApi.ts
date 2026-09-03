import { Meal } from "../types/meal";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export const mealApi = {
  // Obtener recetas aleatorias
  getRandomMeals: async (): Promise<Meal[]> => {
    try {
      const promises = Array(10)
        .fill(null)
        .map(() => fetch(`${BASE_URL}/random.php`).then((res) => res.json()));

      const results = await Promise.all(promises);
      const meals = results
        .map((result) => result.meals?.[0])
        .filter((meal): meal is Meal => meal !== null && meal !== undefined);

      return meals;
    } catch (error) {
      console.error("Error fetching random meals:", error);
      return [];
    }
  },

  // Obtener detalle por ID
  getMealById: async (id: string): Promise<Meal | null> => {
    try {
      const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
      const data = await response.json();
      return data.meals?.[0] || null;
    } catch (error) {
      console.error("Error fetching meal details:", error);
      return null;
    }
  },

  // Buscar por nombre
  searchMeals: async (query: string): Promise<Meal[]> => {
    try {
      const response = await fetch(`${BASE_URL}/search.php?s=${query}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error searching meals:", error);
      return [];
    }
  },

  // Filtrar por categoría
  filterByCategory: async (category: string): Promise<Meal[]> => {
    try {
      const response = await fetch(`${BASE_URL}/filter.php?c=${category}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error filtering by category:", error);
      return [];
    }
  },

  // Obtener categorías
  getCategories: async (): Promise<string[]> => {
    try {
      const response = await fetch(`${BASE_URL}/categories.php`);
      const data = await response.json();
      return data.categories?.map((cat: any) => cat.strCategory) || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },
};
