import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '@/components/SearchBar';
import { KitchenCard } from '@/components/KitchenCard';
import { DishCard } from '@/components/DishCard';
import { kitchens } from '@/mocks/kitchens';
import { dishes } from '@/mocks/dishes';
import { colors } from '@/constants/colors';
import { Search as SearchIcon } from 'lucide-react-native';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [kitchenResults, setKitchenResults] = useState(kitchens);
  const [dishResults, setDishResults] = useState(dishes);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setKitchenResults(kitchens);
      setDishResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // Simulate search delay
    const timer = setTimeout(() => {
      const query = searchQuery.toLowerCase();
      
      const filteredKitchens = kitchens.filter(kitchen => 
        kitchen.name.toLowerCase().includes(query) || 
        kitchen.categories.some(cat => cat.toLowerCase().includes(query))
      );
      
      const filteredDishes = dishes.filter(dish => 
        dish.name.toLowerCase().includes(query) || 
        dish.description.toLowerCase().includes(query) ||
        dish.category.toLowerCase().includes(query)
      );
      
      setKitchenResults(filteredKitchens);
      setDishResults(filteredDishes);
      setIsSearching(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };
  
  const handleSearchClear = () => {
    setSearchQuery('');
  };
  
  const renderEmptyState = () => {
    if (isSearching) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.emptyText}>Searching...</Text>
        </View>
      );
    }
    
    if (searchQuery.trim() === '') {
      return (
        <View style={styles.emptyContainer}>
          <SearchIcon size={48} color={colors.textLight} />
          <Text style={styles.emptyTitle}>Search for food</Text>
          <Text style={styles.emptyText}>Find kitchens, dishes, cuisines...</Text>
        </View>
      );
    }
    
    if (kitchenResults.length === 0 && dishResults.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptyText}>Try different keywords or browse categories</Text>
        </View>
      );
    }
    
    return null;
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearchChange}
          onClear={handleSearchClear}
          placeholder="Search kitchens, dishes, cuisines..."
        />
      </View>
      
      {renderEmptyState() || (
        <FlatList
          data={[]}
          ListHeaderComponent={() => (
            <>
              {kitchenResults.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Kitchens</Text>
                  {kitchenResults.map(kitchen => (
                    <KitchenCard key={kitchen.id} kitchen={kitchen} />
                  ))}
                </View>
              )}
              
              {dishResults.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Dishes</Text>
                  {dishResults.map(dish => (
                    <DishCard key={dish.id} dish={dish} horizontal />
                  ))}
                </View>
              )}
            </>
          )}
          ListFooterComponent={<View style={{ height: 20 }} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
});