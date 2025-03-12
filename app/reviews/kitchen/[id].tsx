import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, Plus } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useReviewStore } from '@/store/review-store';
import { useUserStore } from '@/store/user-store';
import { ReviewCard } from '@/components/ReviewCard';
import { kitchens } from '@/mocks/kitchens';

export default function KitchenReviewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { reviews, getReviewsForTarget, loadInitialReviews } = useReviewStore();
  const { user } = useUserStore();
  const [kitchen, setKitchen] = useState(kitchens.find(k => k.id === id));
  const [kitchenReviews, setKitchenReviews] = useState(getReviewsForTarget(id, 'kitchen'));
  
  useEffect(() => {
    loadInitialReviews();
    setKitchenReviews(getReviewsForTarget(id, 'kitchen'));
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
    
    router.push(`/reviews/write?targetId=${id}&targetType=kitchen`);
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
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <View style={styles.ratingInfo}>
          <Text style={styles.ratingValue}>{kitchen.rating.toFixed(1)}</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                size={16} 
                color={star <= Math.round(kitchen.rating) ? colors.warning : colors.grayDark}
                fill={star <= Math.round(kitchen.rating) ? colors.warning : 'none'}
              />
            ))}
          </View>
          <Text style={styles.reviewCount}>({kitchen.reviewCount} reviews)</Text>
        </View>
        
        <Pressable style={styles.addReviewButton} onPress={handleAddReview}>
          <Plus size={16} color={colors.white} />
          <Text style={styles.addReviewText}>Write a Review</Text>
        </Pressable>
      </View>
      
      <FlatList
        data={kitchenReviews}
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
                      setKitchenReviews(getReviewsForTarget(id, 'kitchen'));
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
            <Text style={styles.emptyText}>Be the first to review this kitchen!</Text>
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