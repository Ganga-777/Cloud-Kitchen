import React from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Star, Clock, DollarSign } from 'lucide-react-native';
import { Kitchen } from '@/types';
import { colors } from '@/constants/colors';
import { currency } from '@/constants/currency';

interface KitchenCardProps {
  kitchen: Kitchen;
  featured?: boolean;
}

export const KitchenCard: React.FC<KitchenCardProps> = ({ kitchen, featured = false }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/kitchen/${kitchen.id}`);
  };

  return (
    <Pressable 
      style={[styles.container, featured && styles.featuredContainer]} 
      onPress={handlePress}
    >
      <Image source={{ uri: kitchen.image }} style={styles.image} />
      
      {featured && (
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredText}>Featured</Text>
        </View>
      )}
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{kitchen.name}</Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Star size={14} color={colors.warning} />
            <Text style={styles.infoText}>{kitchen.rating} ({kitchen.reviewCount})</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Clock size={14} color={colors.textLight} />
            <Text style={styles.infoText}>{kitchen.deliveryTime}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <DollarSign size={14} color={colors.textLight} />
            <Text style={styles.infoText}>{kitchen.deliveryFee}</Text>
          </View>
        </View>
        
        <View style={styles.categoriesContainer}>
          {kitchen.categories.slice(0, 3).map((category, index) => (
            <View key={index} style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          ))}
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
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featuredContainer: {
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featuredText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: colors.text,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: colors.textLight,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryBadge: {
    backgroundColor: colors.gray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    color: colors.textLight,
  },
});