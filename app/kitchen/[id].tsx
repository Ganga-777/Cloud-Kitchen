import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Pressable, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, Clock, DollarSign, MapPin, ShoppingBag, MessageSquare } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { kitchens } from '@/mocks/kitchens';
import { dishes } from '@/mocks/dishes';
import { DishCard } from '@/components/DishCard';
import { useCartStore } from '@/store/cart-store';
import { useReviewStore } from '@/store/review-store';
import { ReviewCard } from '@/components/ReviewCard';

export default function KitchenScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [kitchen, setKitchen] = useState(kitchens.find(k => k.id === id));
  const [kitchenDishes, setKitchenDishes] = useState(dishes.filter(d => d.kitchenId === id));
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const itemCount = useCartStore(state => state.getItemCount());
  const { getReviewsForTarget, loadInitialReviews } = useReviewStore();
  
  // Get kitchen reviews
  const [kitchenReviews, setKitchenReviews] = useState(getReviewsForTarget(id, 'kitchen'));
  
  useEffect(() => {
    loadInitialReviews();
    setKitchenReviews(getReviewsForTarget(id, 'kitchen'));
  }, [id]);
  
  // Get unique categories from kitchen dishes
  const categories = Array.from(new Set(kitchenDishes.map(dish => dish.category)));
  
  // Filter dishes by selected category
  const filteredDishes = selectedCategory
    ? kitchenDishes.filter(dish => dish.category === selectedCategory)
    : kitchenDishes;
  
  const navigateToCart = () => {
    router.push('/cart');
  };
  
  const navigateToReviews = () => {
    router.push(`/reviews/kitchen/${id}`);
  };
  
  if (!kitchen) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Kitchen not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: kitchen.image }} style={styles.coverImage} />
        
        <View style={styles.content}>
          <Text style={styles.name}>{kitchen.name}</Text>
          
          <View style={styles.infoContainer}>
            <Pressable style={styles.ratingContainer} onPress={navigateToReviews}>
              <Star size={16} color={colors.warning} />
              <Text style={styles.infoText}>{kitchen.rating} ({kitchen.reviewCount} reviews)</Text>
            </Pressable>
            
            <View style={styles.infoItem}>
              <Clock size={16} color={colors.textLight} />
              <Text style={styles.infoText}>{kitchen.deliveryTime}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <DollarSign size={16} color={colors.textLight} />
              <Text style={styles.infoText}>{kitchen.deliveryFee} delivery</Text>
            </View>
          </View>
          
          <Text style={styles.description}>{kitchen.description}</Text>
          
          <View style={styles.categoriesContainer}>
            {kitchen.categories.map((category, index) => (
              <View key={index} style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            ))}
          </View>
          
          {kitchenReviews.length > 0 && (
            <View style={styles.reviewsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Reviews</Text>
                <Pressable onPress={navigateToReviews}>
                  <Text style={styles.viewAllText}>View All</Text>
                </Pressable>
              </View>
              
              <ReviewCard review={kitchenReviews[0]} />
              
              {kitchenReviews.length > 1 && (
                <Pressable style={styles.moreReviewsButton} onPress={navigateToReviews}>
                  <MessageSquare size={16} color={colors.primary} />
                  <Text style={styles.moreReviewsText}>
                    Read {kitchenReviews.length - 1} more reviews
                  </Text>
                </Pressable>
              )}
            </View>
          )}
          
          <View style={styles.divider} />
          
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>Menu</Text>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.menuCategoriesContainer}
            >
              <Pressable
                style={[
                  styles.menuCategoryItem,
                  selectedCategory === null && styles.selectedMenuCategoryItem
                ]}
                onPress={() => setSelectedCategory(null)}
              >
                <Text 
                  style={[
                    styles.menuCategoryText,
                    selectedCategory === null && styles.selectedMenuCategoryText
                  ]}
                >
                  All
                </Text>
              </Pressable>
              
              {categories.map(category => (
                <Pressable
                  key={category}
                  style={[
                    styles.menuCategoryItem,
                    selectedCategory === category && styles.selectedMenuCategoryItem
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text 
                    style={[
                      styles.menuCategoryText,
                      selectedCategory === category && styles.selectedMenuCategoryText
                    ]}
                  >
                    {category}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            
            <View style={styles.dishesContainer}>
              {filteredDishes.map(dish => (
                <DishCard key={dish.id} dish={dish} horizontal />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      
      {itemCount > 0 && (
        <Pressable style={styles.cartButton} onPress={navigateToCart}>
          <ShoppingBag size={20} color={colors.white} />
          <Text style={styles.cartButtonText}>View Cart ({itemCount})</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.textLight,
  },
  coverImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 14,
    color: colors.textLight,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 20,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: colors.gray,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    color: colors.textLight,
  },
  reviewsSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  moreReviewsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  moreReviewsText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  menuContainer: {
    marginBottom: 80, // Space for cart button
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  menuCategoriesContainer: {
    paddingBottom: 16,
    gap: 12,
  },
  menuCategoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.gray,
  },
  selectedMenuCategoryItem: {
    backgroundColor: colors.primary,
  },
  menuCategoryText: {
    fontSize: 14,
    color: colors.textLight,
  },
  selectedMenuCategoryText: {
    color: colors.white,
    fontWeight: '600',
  },
  dishesContainer: {
    gap: 16,
  },
  cartButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: colors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  cartButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});