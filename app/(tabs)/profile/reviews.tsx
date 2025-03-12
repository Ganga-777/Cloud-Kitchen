import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Star, MessageSquare } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useReviewStore } from '@/store/review-store';
import { useUserStore } from '@/store/user-store';
import { ReviewCard } from '@/components/ReviewCard';

export default function UserReviewsScreen() {
  const router = useRouter();
  const { reviews, getUserReviews, loadInitialReviews, deleteReview } = useReviewStore();
  const { user } = useUserStore();
  
  useEffect(() => {
    loadInitialReviews();
  }, []);
  
  const userReviews = user ? getUserReviews(user.id) : [];
  
  const handleEditReview = (reviewId: string) => {
    router.push(`/reviews/edit/${reviewId}`);
  };
  
  const handleDeleteReview = (reviewId: string) => {
    Alert.alert(
      "Delete Review",
      "Are you sure you want to delete this review?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: () => deleteReview(reviewId),
          style: "destructive"
        }
      ]
    );
  };
  
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.signInContainer}>
          <MessageSquare size={48} color={colors.textLight} />
          <Text style={styles.signInTitle}>Sign in to view your reviews</Text>
          <Text style={styles.signInText}>Your reviews will appear here after you sign in</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={userReviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReviewCard 
            review={item} 
            showActions={true}
            onEdit={() => handleEditReview(item.id)}
            onDelete={() => handleDeleteReview(item.id)}
          />
        )}
        contentContainerStyle={styles.reviewsList}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Your Reviews</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userReviews.length}</Text>
                <Text style={styles.statLabel}>Reviews</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {userReviews.length > 0 
                    ? (userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length).toFixed(1)
                    : '0.0'
                  }
                </Text>
                <Text style={styles.statLabel}>Avg. Rating</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {userReviews.reduce((sum, review) => sum + review.likes, 0)}
                </Text>
                <Text style={styles.statLabel}>Likes</Text>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Star size={48} color={colors.textLight} />
            <Text style={styles.emptyTitle}>No Reviews Yet</Text>
            <Text style={styles.emptyText}>You haven't written any reviews yet</Text>
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
  signInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  signInTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  signInText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.gray,
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  reviewsList: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 40,
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