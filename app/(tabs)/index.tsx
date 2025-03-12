import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingBag } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { kitchens } from '@/mocks/kitchens';
import { dishes } from '@/mocks/dishes';
import { categories } from '@/mocks/categories';
import { KitchenCard } from '@/components/KitchenCard';
import { DishCard } from '@/components/DishCard';
import { CategoryList } from '@/components/CategoryList';
import { SearchBar } from '@/components/SearchBar';
import { useCartStore } from '@/store/cart-store';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const itemCount = useCartStore(state => state.getItemCount());
  
  const featuredKitchens = kitchens.filter(kitchen => kitchen.featured);
  const popularDishes = dishes.filter(dish => dish.popular);
  
  const filteredKitchens = selectedCategoryId
    ? kitchens.filter(kitchen => kitchen.categories.some(cat => 
        categories.find(c => c.id === selectedCategoryId)?.name === cat
      ))
    : kitchens;
  
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId === selectedCategoryId ? undefined : categoryId);
  };
  
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };
  
  const handleSearchClear = () => {
    setSearchQuery('');
  };
  
  const navigateToCart = () => {
    router.push('/cart');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={handleSearchChange}
              onClear={handleSearchClear}
            />
          </View>
          
          {itemCount > 0 && (
            <Pressable style={styles.cartButton} onPress={navigateToCart}>
              <ShoppingBag size={24} color={colors.primary} />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{itemCount}</Text>
              </View>
            </Pressable>
          )}
        </View>
        
        <View style={styles.categoriesSection}>
          <CategoryList
            categories={categories}
            onSelectCategory={handleCategorySelect}
            selectedCategoryId={selectedCategoryId}
          />
        </View>
        
        {featuredKitchens.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured Kitchens</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredContainer}
            >
              {featuredKitchens.map(kitchen => (
                <View key={kitchen.id} style={styles.featuredKitchenCard}>
                  <KitchenCard kitchen={kitchen} featured />
                </View>
              ))}
            </ScrollView>
          </View>
        )}
        
        {popularDishes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Dishes</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dishesContainer}
            >
              {popularDishes.map(dish => (
                <View key={dish.id} style={styles.dishCard}>
                  <DishCard dish={dish} />
                </View>
              ))}
            </ScrollView>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedCategoryId 
              ? `${categories.find(c => c.id === selectedCategoryId)?.name} Kitchens` 
              : 'All Kitchens'}
          </Text>
          <View style={styles.kitchensContainer}>
            {filteredKitchens.map(kitchen => (
              <KitchenCard key={kitchen.id} kitchen={kitchen} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainer: {
    flex: 1,
  },
  cartButton: {
    marginLeft: 16,
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  categoriesSection: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 16,
    color: colors.text,
  },
  featuredContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  featuredKitchenCard: {
    width: 300,
  },
  dishesContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  dishCard: {
    marginRight: 12,
  },
  kitchensContainer: {
    paddingHorizontal: 16,
  },
});