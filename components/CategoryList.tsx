import React from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Image } from 'react-native';
import { Category } from '@/types';
import { colors } from '@/constants/colors';

interface CategoryListProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
  selectedCategoryId?: string;
}

export const CategoryList: React.FC<CategoryListProps> = ({ 
  categories, 
  onSelectCategory,
  selectedCategoryId
}) => {
  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <Pressable 
          style={[
            styles.categoryItem,
            selectedCategoryId === item.id && styles.selectedCategoryItem
          ]}
          onPress={() => onSelectCategory(item.id)}
        >
          <Image source={{ uri: item.image }} style={styles.categoryImage} />
          <Text 
            style={[
              styles.categoryName,
              selectedCategoryId === item.id && styles.selectedCategoryName
            ]}
          >
            {item.name}
          </Text>
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  categoryItem: {
    alignItems: 'center',
    width: 70,
  },
  selectedCategoryItem: {
    opacity: 1,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: colors.grayDark,
  },
  categoryName: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  selectedCategoryName: {
    color: colors.primary,
    fontWeight: '600',
  },
});