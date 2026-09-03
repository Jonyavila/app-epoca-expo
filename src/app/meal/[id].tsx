import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { mealApi } from "../../services/mealApi";
import { Meal } from "../../types/meal";

export default function MealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMeal = async () => {
      try {
        const mealData = await mealApi.getMealById(id);
        setMeal(mealData);
      } catch (error) {
        console.error("Error loading meal detail:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadMeal();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  if (!meal) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No se encontró la receta</Text>
      </View>
    );
  }

  // Obtener ingredientes
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredientKey = `strIngredient${i}` as keyof Meal;
    const measureKey = `strMeasure${i}` as keyof Meal;
    const ingredient = meal[ingredientKey];
    const measure = meal[measureKey];
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure?.trim() || "",
      });
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image
        source={{ uri: meal.strMealThumb }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* <View style={styles.content}>
        <Text style={styles.title}>{meal.strMeal}</Text> */}
<View style={styles.content}><Text style={styles.title}>{meal.strMeal}</Text>
        <View style={styles.metaContainer}>
          {meal.strCategory && (
            <View style={styles.metaTag}>
              <Text style={styles.metaTagText}>🍽️ {meal.strCategory}</Text>
            </View>
          )}
          {meal.strArea && (
            <View style={[styles.metaTag, styles.areaTag]}>
              <Text style={styles.metaTagText}>🌍 {meal.strArea}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Instrucciones</Text>
          <Text style={styles.instructions}>{meal.strInstructions}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛒 Ingredientes</Text>
          {ingredients.map((item, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Text style={styles.ingredientName}>• {item.ingredient}</Text>
              <Text style={styles.ingredientMeasure}>
                {item.measure || "Al gusto"}
              </Text>
            </View>
          ))}
        </View>

        {meal.strYoutube && (
          <Text style={styles.youtubeLink}>▶️ Ver receta en YouTube</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#999",
  },
  image: {
    width: "100%",
    height: 300,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    gap: 8,
  },
  metaTag: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  areaTag: {
    backgroundColor: "#4CAF50",
  },
  metaTagText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
    textAlign: "justify",
  },
  ingredientItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  ingredientName: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  ingredientMeasure: {
    fontSize: 16,
    color: "#777",
    fontWeight: "500",
  },
  youtubeLink: {
    fontSize: 16,
    color: "#FF6B35",
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 20,
  },
});
