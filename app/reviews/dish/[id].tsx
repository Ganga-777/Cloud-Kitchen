import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, Plus } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useReviewStore } from '@/store/review-store';
import { useUserStore } from '@/store/user-store';
import { ReviewCard } from '@/components/ReviewCard';
import { dishes } from '@/mocks/dishes';

export default function DishReviewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { reviews, getReviewsForTarget, loadInitialReviews } = useReviewStore();
  const { user } = useUserStore();
  const [dish, setDish] = useState(dishes.find(d => d.id === id));
  const [dishReviews, setDishReviews] = useState(getReviewsForTarget(id, 'dish'));
  
  useEffect(() => {
    loadInitialReviews();
    setDishReviews(getReviewsForTarget(id, 'dish'));
  }, [id, reviews]);
  
  const handleAddReview = () => {
    if (!user) {
      Alert.alert(
        "Sign In Required",
        "Please sign in to write a review",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Sign In", onPress: () => router.push('/profile') }
        ]
      );
      return;
    }
    
    router.push(`/reviews/write?targetId=${id}&targetType=dish`);
  };
  
  // Calculate average rating
  const averageRating = dishReviews.length > 0
    ? dishReviews.reduce((sum, review) => sum + review.rating, 0) / dishReviews.length
    : 0;
  
  if (!dish) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Dish not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.dishHeader}>
        <Image source={{ uri: dish.image }} style={styles.dishImage} />
        <View style={styles.dishInfo}>
          <Text style={styles.dishName}>{dish.name}</Text>
          <Text style={styles.dishPrice}>${dish.price.toFixed(2)}</Text>
        </View>
      </View>
      
      <View style={styles.header}>
        <View style={styles.ratingInfo}>
          <Text style={styles.ratingValue}>{averageRating.toFixed(1)}</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                size={16} 
                color={star <= Math.round(averageRating) ? colors.warning : colors.grayDark}
                fill={star <= Math.round(averageRating) ? colors.warning : 'none'}
              />
            ))}
          </View>
          <Text style={styles.reviewCount}>({dishReviews.length} reviews)</Text>
        </View>
        
        <Pressable style={styles.addReviewButton} onPress={handleAddReview}>
          <Plus size={16} color={colors.white} />
          <Text style={styles.addReviewText}>Write a Review</Text>
        </Pressable>
      </View>
      
      <FlatList
        data={dishReviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReviewCard 
            review={item} 
            showActions={user?.id === item.userId}
            onEdit={() => router.push(`/reviews/edit/${item.id}`)}
            onDelete={() => {
              Alert.alert(
                "Delete Review",
                "Are you sure you want to delete this review?",
                [
                  { text: "Cancel", style: "cancel" },
                  { 
                    text: "Delete", 
                    onPress: () => {
                      useReviewStore.getState().deleteReview(item.id);
                      setDishReviews(getReviewsForTarget(id, 'dish'));
                    },
                    style: "destructive"
                  }
                ]
              );
            }}
          />
        )}
        contentContainerStyle={styles.reviewsList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Reviews Yet</Text>
            <Text style={styles.emptyText}>Be the first to review this dish!</Text>
          </View>
        }
      />
    </SafeAreaView>
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
  dishHeader: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dishImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  dishInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  dishName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  dishPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  ratingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginRight: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
    marginRight: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: colors.textLight,
  },
  addReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addReviewText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  reviewsList: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
});