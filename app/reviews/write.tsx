import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, Alert, Pressable, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/colors';
import { useReviewStore } from '@/store/review-store';
import { useUserStore } from '@/store/user-store';
import { Button } from '@/components/Button';
import { RatingInput } from '@/components/RatingInput';
import { kitchens } from '@/mocks/kitchens';
import { dishes } from '@/mocks/dishes';

export default function WriteReviewScreen() {
  const { targetId, targetType } = useLocalSearchParams<{ targetId: string; targetType: 'kitchen' | 'dish' }>();
  const router = useRouter();
  const { addReview } = useReviewStore();
  const { user } = useUserStore();
  
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [targetName, setTargetName] = useState('');
  const [targetImage, setTargetImage] = useState('');
  
  useEffect(() => {
    if (targetType === 'kitchen') {
      const kitchen = kitchens.find(k => k.id === targetId);
      if (kitchen) {
        setTargetName(kitchen.name);
        setTargetImage(kitchen.image);
      }
    } else if (targetType === 'dish') {
      const dish = dishes.find(d => d.id === targetId);
      if (dish) {
        setTargetName(dish.name);
        setTargetImage(dish.image);
      }
    }
  }, [targetId, targetType]);
  
  const handleAddPhoto = async () => {
    if (photos.length >= 3) {
      Alert.alert("Limit Reached", "You can only add up to 3 photos");
      return;
    }
    
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to your photos to add images");
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };
  
  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };
  
  const handleSubmit = () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to submit a review");
      return;
    }
    
    if (rating === 0) {
      Alert.alert("Error", "Please select a rating");
      return;
    }
    
    if (reviewText.trim().length < 10) {
      Alert.alert("Error", "Please write a review with at least 10 characters");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      addReview({
        userId: user.id,
        userName: user.name,
        targetId,
        targetType,
        rating,
        text: reviewText,
        photos
      });
      
      setIsSubmitting(false);
      
      Alert.alert(
        "Review Submitted",
        "Thank you for your review!",
        [
          { 
            text: "OK", 
            onPress: () => {
              if (targetType === 'kitchen') {
                router.push(`/reviews/kitchen/${targetId}`);
              } else {
                router.push(`/reviews/dish/${targetId}`);
              }
            }
          }
        ]
      );
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.targetInfo}>
          <Image source={{ uri: targetImage }} style={styles.targetImage} />
          <View>
            <Text style={styles.targetType}>
              {targetType === 'kitchen' ? 'Kitchen Review' : 'Dish Review'}
            </Text>
            <Text style={styles.targetName}>{targetName}</Text>
          </View>
        </View>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.sectionTitle}>Your Rating</Text>
          <RatingInput rating={rating} onRatingChange={setRating} />
        </View>
        
        <View style={styles.reviewContainer}>
          <Text style={styles.sectionTitle}>Your Review</Text>
          <TextInput
            style={styles.reviewInput}
            placeholder="Share your experience with this item..."
            placeholderTextColor={colors.textExtraLight}
            multiline
            numberOfLines={6}
            value={reviewText}
            onChangeText={setReviewText}
            textAlignVertical="top"
          />
        </View>
        
        <View style={styles.photosContainer}>
          <Text style={styles.sectionTitle}>Add Photos (Optional)</Text>
          <Text style={styles.photoSubtitle}>Add up to 3 photos to your review</Text>
          
          <View style={styles.photoGrid}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoItem}>
                <Image source={{ uri: photo }} style={styles.photo} />
                <Pressable 
                  style={styles.removePhotoButton}
                  onPress={() => handleRemovePhoto(index)}
                >
                  <X size={16} color={colors.white} />
                </Pressable>
              </View>
            ))}
            
            {photos.length < 3 && (
              <Pressable style={styles.addPhotoButton} onPress={handleAddPhoto}>
                <Camera size={24} color={colors.textLight} />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Submit Review"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={rating === 0 || reviewText.trim().length < 10}
          style={styles.submitButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  targetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  targetImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  targetType: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  targetName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  ratingContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  reviewContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    minHeight: 120,
  },
  photosContainer: {
    padding: 16,
    paddingBottom: 80, // Space for footer
  },
  photoSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoItem: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 16,
  },
  submitButton: {
    width: '100%',
  },
});