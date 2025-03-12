import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Review } from '@/types';
import { reviews as mockReviews } from '@/mocks/reviews';

interface ReviewState {
  reviews: Review[];
  userReviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'likes'>) => Review;
  getReviewsForTarget: (targetId: string, targetType: 'kitchen' | 'dish') => Review[];
  getUserReviews: (userId: string) => Review[];
  deleteReview: (reviewId: string) => void;
  updateReview: (reviewId: string, updates: Partial<Omit<Review, 'id' | 'userId' | 'targetId' | 'targetType'>>) => void;
  likeReview: (reviewId: string) => void;
  loadInitialReviews: () => void;
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: [],
      userReviews: [],
      
      addReview: (reviewData) => {
        const newReview: Review = {
          ...reviewData,
          id: Date.now().toString(),
          date: new Date().toISOString(),
          likes: 0,
          photos: reviewData.photos || []
        };
        
        set(state => ({
          reviews: [newReview, ...state.reviews],
          userReviews: reviewData.userId === '1' ? [newReview, ...state.userReviews] : state.userReviews
        }));
        
        return newReview;
      },
      
      getReviewsForTarget: (targetId, targetType) => {
        return get().reviews.filter(
          review => review.targetId === targetId && review.targetType === targetType
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },
      
      getUserReviews: (userId) => {
        return get().reviews.filter(review => review.userId === userId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },
      
      deleteReview: (reviewId) => {
        set(state => ({
          reviews: state.reviews.filter(review => review.id !== reviewId),
          userReviews: state.userReviews.filter(review => review.id !== reviewId)
        }));
      },
      
      updateReview: (reviewId, updates) => {
        set(state => ({
          reviews: state.reviews.map(review => 
            review.id === reviewId ? { ...review, ...updates } : review
          ),
          userReviews: state.userReviews.map(review => 
            review.id === reviewId ? { ...review, ...updates } : review
          )
        }));
      },
      
      likeReview: (reviewId) => {
        set(state => ({
          reviews: state.reviews.map(review => 
            review.id === reviewId ? { ...review, likes: review.likes + 1 } : review
          ),
          userReviews: state.userReviews.map(review => 
            review.id === reviewId ? { ...review, likes: review.likes + 1 } : review
          )
        }));
      },
      
      loadInitialReviews: () => {
        // Only load mock reviews if there are no reviews yet
        if (get().reviews.length === 0) {
          set({ 
            reviews: mockReviews,
            userReviews: mockReviews.filter(review => review.userId === '1')
          });
        }
      }
    }),
    {
      name: 'review-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);