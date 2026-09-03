import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { MealCard } from "../../components/MealCard";
import { mealApi } from "../../services/mealApi";
import { Meal } from "../../types/meal";

export default function CategoriesScreen() {
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [meals, setMeals] = useState<Meal[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMeals, setLoadingMeals] = useState(false);

    // Cargar categorías
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const cats = await mealApi.getCategories();
                setCategories(cats);
            } catch (error) {
                console.error("Error loading categories:", error);
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

    // Cargar recetas por categoría
    const loadMealsByCategory = async (category: string) => {
        //  deseleccionar
        if (selectedCategory === category) {
            setSelectedCategory("");
            setMeals([]);
            return;
        }

        setLoadingMeals(true);
        setSelectedCategory(category);
        try {
            const mealsData = await mealApi.filterByCategory(category);
            setMeals(mealsData);
        } catch (error) {
            console.error("Error loading meals by category:", error);
            setMeals([]);
        } finally {
            setLoadingMeals(false);
        }
    };

    const handleMealPress = (mealId: string) => {
        router.push(`/meal/${mealId}`);
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#FF6B35" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* CATEGORIAS HORIZONTALES */}
            <View style={styles.categoryWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryList}
                >
                    {categories.map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={[
                                styles.categoryItem,
                                selectedCategory === item && styles.categoryItemActive,
                            ]}
                            onPress={() => loadMealsByCategory(item)}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    selectedCategory === item && styles.categoryTextActive,
                                ]}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* INDICADOR DE CATEGORÍA SELECCIONADA */}
            {selectedCategory ? (
                <View style={styles.selectedInfo}>
                    <Text style={styles.selectedText}>
                        Mostrando: <Text style={styles.selectedHighlight}>{selectedCategory}</Text>
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedCategory("");
                            setMeals([]);
                        }}
                    >
                        <Ionicons name="close-circle" size={24} color="#FF6B35" />
                    </TouchableOpacity>
                </View>
            ) : null}

            {/*FlatList ocupa el resto del espacio */}
            {loadingMeals ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#FF6B35" />
                    <Text style={styles.loadingText}>Cargando recetas...</Text>
                </View>
            ) : selectedCategory && meals.length > 0 ? (
                <FlatList
                    data={meals}
                    keyExtractor={(item, index) => `${item.idMeal}-${index}`}
                    renderItem={({ item }) => (
                        <MealCard
                            meal={item}
                            onPress={() => handleMealPress(item.idMeal)}
                        />
                    )}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    // actualizar categoria
                    extraData={selectedCategory}
                />
            ) : selectedCategory && meals.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Ionicons name="restaurant-outline" size={64} color="#ddd" />
                    <Text style={styles.noResults}>No hay recetas en esta categoría</Text>
                    <TouchableOpacity
                        style={styles.backButtonLarge}
                        onPress={() => {
                            setSelectedCategory("");
                            setMeals([]);
                        }}
                    >
                        <Text style={styles.backButtonLargeText}>Volver a categorías</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.centerContainer}>
                    <Ionicons name="grid-outline" size={64} color="#ddd" />
                    <Text style={styles.placeholderText}>Selecciona una categoría</Text>
                    <Text style={styles.placeholderSubText}>
                        Toca cualquier categoría para ver sus recetas
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    categoryWrapper: {
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    categoryList: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    categoryItem: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: "#f0f0f0",
        marginRight: 10,
    },
    categoryItemActive: {
        backgroundColor: "#FF6B35",
    },
    categoryText: {
        fontSize: 14,
        color: "#666",
    },
    categoryTextActive: {
        color: "#fff",
        fontWeight: "600",
    },
    selectedInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    selectedText: {
        fontSize: 14,
        color: "#666",
    },
    selectedHighlight: {
        fontWeight: "bold",
        color: "#FF6B35",
    },
    list: {
        paddingVertical: 8,
        paddingBottom: 80,
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
    placeholderText: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    placeholderSubText: {
        marginTop: 8,
        fontSize: 14,
        color: "#999",
        textAlign: "center",
    },
    backButtonLarge: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: "#FF6B35",
        borderRadius: 8,
    },
    backButtonLargeText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});