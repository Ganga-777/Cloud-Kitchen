import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { CartItem as CartItemType } from '@/types';
import { colors } from '@/constants/colors';
import { useCartStore } from '@/store/cart-store';
import { currency } from '@/constants/currency';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCartStore();
  
  const handleIncrement = () => {
    updateQuantity(item.dish.id, item.quantity + 1);
  };
  
  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.dish.id, item.quantity - 1);
    } else {
      removeFromCart(item.dish.id);
    }
  };
  
  const handleRemove = () => {
    removeFromCart(item.dish.id);
  };
  
  // Calculate item total price including options
  const calculateItemTotal = () => {
    let total = item.dish.price * item.quantity;
    
    if (item.selectedOptions) {
      Object.entries(item.selectedOptions).forEach(([optionName, selectedChoiceIds]) => {
        const option = item.dish.options?.find(opt => opt.name === optionName);
        if (option) {
          selectedChoiceIds.forEach(choiceId => {
            const choice = option.choices.find(c => c.id === choiceId);
            if (choice) {
              total += choice.price * item.quantity;
            }
          });
        }
      });
    }
    
    return currency.symbol + currency.format(total);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.dishInfo}>
          <Text style={styles.dishName}>{item.dish.name}</Text>
          
          {/* Display selected options */}
          {item.selectedOptions && Object.entries(item.selectedOptions).map(([optionName, selectedChoiceIds]) => {
            const option = item.dish.options?.find(opt => opt.name === optionName);
            if (!option) return null;
            
            const choiceNames = selectedChoiceIds.map(choiceId => {
              const choice = option.choices.find(c => c.id === choiceId);
              return choice?.name;
            }).filter(Boolean).join(', ');
            
            return (
              <Text key={optionName} style={styles.optionText}>
                {optionName}: {choiceNames}
              </Text>
            );
          })}
          
          {/* Display special instructions if any */}
          {item.specialInstructions && (
            <Text style={styles.specialInstructions}>
              Note: {item.specialInstructions}
            </Text>
          )}
        </View>
        
        <Text style={styles.price}>{calculateItemTotal()}</Text>
      </View>
      
      <View style={styles.actionsContainer}>
        <Pressable onPress={handleRemove} style={styles.removeButton}>
          <Trash2 size={16} color={colors.error} />
        </Pressable>
        
        <View style={styles.quantityContainer}>
          <Pressable onPress={handleDecrement} style={styles.quantityButton}>
            <Minus size={16} color={colors.text} />
          </Pressable>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <Pressable onPress={handleIncrement} style={styles.quantityButton}>
            <Plus size={16} color={colors.text} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dishInfo: {
    flex: 1,
    marginRight: 8,
  },
  dishName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  optionText: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 2,
  },
  specialInstructions: {
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.textLight,
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  removeButton: {
    padding: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray,
    borderRadius: 8,
    overflow: 'hidden',
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: 8,
  },
});