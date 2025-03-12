import React from 'react';
import { StyleSheet, Text, View, Pressable, Image, ScrollView } from 'react-native';
import { Star, ThumbsUp, MoreHorizontal } from 'lucide-react-native';
import { Review } from '@/types';
import { colors } from '@/constants/colors';
import { useReviewStore } from '@/store/review-store';

interface ReviewCardProps {
  review: Review;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ 
  review, 
  showActions = false,
  onEdit,
  onDelete
}) => {
  const { likeReview } = useReviewStore();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  const handleLike = () => {
    likeReview(review.id);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <Text style={styles.userInitial}>{review.userName.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{review.userName}</Text>
            <Text style={styles.reviewDate}>{formatDate(review.date)}</Text>
          </View>
        </View>
        
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star}
              size={16} 
              color={star <= review.rating ? colors.warning : colors.grayDark}
              fill={star <= review.rating ? colors.warning : 'none'}
            />
          ))}
        </View>
      </View>
      
      <Text style={styles.reviewText}>{review.text}</Text>
      
      {review.photos && review.photos.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.photosContainer}
        >
          {review.photos.map((photo, index) => (
            <Image 
              key={index} 
              source={{ uri: photo }} 
              style={styles.reviewPhoto} 
            />
          ))}
        </ScrollView>
      )}
      
      <View style={styles.footer}>
        <Pressable style={styles.likeButton} onPress={handleLike}>
          <ThumbsUp size={16} color={colors.textLight} />
          <Text style={styles.likeCount}>{review.likes}</Text>
        </Pressable>
        
        {showActions && (
          <View style={styles.actionsContainer}>
            {onEdit && (
              <Pressable style={styles.actionButton} onPress={onEdit}>
                <Text style={styles.actionText}>Edit</Text>
              </Pressable>
            )}
            
            {onDelete && (
              <Pressable style={styles.actionButton} onPress={onDelete}>
                <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  photosContainer: {
    marginBottom: 12,
    gap: 8,
  },
  reviewPhoto: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  likeCount: {
    fontSize: 12,
    color: colors.textLight,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  deleteText: {
    color: colors.error,
  },
});