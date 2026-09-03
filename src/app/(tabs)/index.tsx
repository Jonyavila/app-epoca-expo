import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { LoadingScreen } from "../../components/LoadingScreen";
import { MealCard } from "../../components/MealCard";
import { mealApi } from "../../services/mealApi";
import { Meal } from "../../types/meal";

export default function HomeScreen() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMeals = useCallback(async () => {
    try {
      const randomMeals = await mealApi.getRandomMeals();
      setMeals(randomMeals);
    } catch (error) {
      console.error("Error loading meals:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  const onRefresh = () => {
    setRefreshing(true);
    loadMeals();
  };

  const handleMealPress = (mealId: string) => {
    router.push(`/meal/${mealId}`);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <MealCard meal={item} onPress={() => handleMealPress(item.idMeal)} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF6B35"
          />
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  list: {
    paddingVertical: 16,
  },
});
