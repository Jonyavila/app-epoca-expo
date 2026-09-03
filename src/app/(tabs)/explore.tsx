import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MealCard } from "../../components/MealCard";
import { mealApi } from "../../services/mealApi";
import { Meal } from "../../types/meal";

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const meals = await mealApi.searchMeals(searchQuery);
      setResults(meals);
    } catch (error) {
      console.error("Error searching:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMealPress = (mealId: string) => {
    router.push(`/meal/${mealId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Buscar recetas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Buscando recetas...</Text>
        </View>
      ) : searched && results.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="restaurant-outline" size={64} color="#ddd" />
          <Text style={styles.noResults}>No se encontraron recetas</Text>
          <Text style={styles.noResultsSub}>Prueba con otro término</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => (
            <MealCard
              meal={item}
              onPress={() => handleMealPress(item.idMeal)}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  list: {
    paddingVertical: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  noResults: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  noResultsSub: {
    marginTop: 8,
    fontSize: 14,
    color: "#999",
  },
});
