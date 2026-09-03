import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Meal } from "../types/meal";

interface MealCardProps {
  meal: Meal;
  onPress: () => void;
}

export const MealCard = ({ meal, onPress }: MealCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={{ uri: meal.strMealThumb }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {meal.strMeal}
        </Text>
        <View style={styles.tags}>
          {meal.strCategory && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{meal.strCategory}</Text>
            </View>
          )}
          {meal.strArea && (
            <View style={[styles.tag, styles.areaTag]}>
              <Text style={styles.tagText}>{meal.strArea}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 200,
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  areaTag: {
    backgroundColor: "#4CAF50",
  },
  tagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
