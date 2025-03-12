import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Star } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface RatingInputProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: number;
  label?: string;
}

export const RatingInput: React.FC<RatingInputProps> = ({
  rating,
  onRatingChange,
  size = 32,
  label
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable
            key={star}
            onPress={() => onRatingChange(star)}
            style={styles.starButton}
          >
            <Star
              size={size}
              color={star <= rating ? colors.warning : colors.grayDark}
              fill={star <= rating ? colors.warning : 'none'}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
});