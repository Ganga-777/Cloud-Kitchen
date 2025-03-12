import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  minQuantity?: number;
  maxQuantity?: number;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  minQuantity = 1,
  maxQuantity = 99
}) => {
  const isDecrementDisabled = quantity <= minQuantity;
  const isIncrementDisabled = quantity >= maxQuantity;

  return (
    <View style={styles.container}>
      <Pressable 
        style={[styles.button, isDecrementDisabled && styles.disabledButton]} 
        onPress={onDecrement}
        disabled={isDecrementDisabled}
      >
        <Minus 
          size={16} 
          color={isDecrementDisabled ? colors.textExtraLight : colors.text} 
        />
      </Pressable>
      
      <Text style={styles.quantity}>{quantity}</Text>
      
      <Pressable 
        style={[styles.button, isIncrementDisabled && styles.disabledButton]} 
        onPress={onIncrement}
        disabled={isIncrementDisabled}
      >
        <Plus 
          size={16} 
          color={isIncrementDisabled ? colors.textExtraLight : colors.text} 
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray,
    borderRadius: 8,
    overflow: 'hidden',
  },
  button: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: 12,
    minWidth: 40,
    textAlign: 'center',
  },
});