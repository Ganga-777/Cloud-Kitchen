import React from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Flame, Leaf, Plus } from 'lucide-react-native';
import { Dish } from '@/types';
import { colors } from '@/constants/colors';
import { currency } from '@/constants/currency';

interface DishCardProps {
  dish: Dish;
  horizontal?: boolean;
}

export const DishCard: React.FC<DishCardProps> = ({ dish, horizontal = false }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/dish/${dish.id}`);
  };

  return (
    <Pressable 
      style={[
        styles.container, 
        horizontal ? styles.horizontalContainer : styles.verticalContainer
      ]} 
      onPress={handlePress}
    >
      <Image 
        source={{ uri: dish.image }} 
        style={horizontal ? styles.horizontalImage : styles.verticalImage} 
      />
      
      <View style={horizontal ? styles.horizontalContent : styles.verticalContent}>
        <View style={styles.nameContainer}>
          <Text style={styles.name} numberOfLines={2}>{dish.name}</Text>
          <View style={styles.badgesContainer}>
            {dish.vegetarian && (
              <View style={[styles.badge, styles.vegBadge]}>
                <Leaf size={12} color={colors.success} />
              </View>
            )}
            {dish.spicy && (
              <View style={[styles.badge, styles.spicyBadge]}>
                <Flame size={12} color={colors.error} />
              </View>
            )}
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={horizontal ? 2 : 1}>
          {dish.description}
        </Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{currency.symbol}{currency.format(dish.price)}</Text>
          <Pressable style={styles.addButton}>
            <Plus size={16} color={colors.white} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  verticalContainer: {
    width: 160,
    height: 220,
  },
  horizontalContainer: {
    flexDirection: 'row',
    height: 120,
    marginBottom: 16,
  },
  verticalImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  horizontalImage: {
    width: 120,
    height: '100%',
    resizeMode: 'cover',
  },
  verticalContent: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  horizontalContent: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  badgesContainer: {
    flexDirection: 'row',
    marginLeft: 4,
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  vegBadge: {
    backgroundColor: colors.secondaryLight,
  },
  spicyBadge: {
    backgroundColor: colors.primaryLight,
  },
  description: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});