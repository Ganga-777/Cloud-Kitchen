import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Pressable, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flame, Leaf, ChevronDown, ChevronUp, Check, Star, MessageSquare } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { dishes } from '@/mocks/dishes';
import { kitchens } from '@/mocks/kitchens';
import { Button } from '@/components/Button';
import { QuantitySelector } from '@/components/QuantitySelector';
import { useCartStore } from '@/store/cart-store';
import { useReviewStore } from '@/store/review-store';
import { ReviewCard } from '@/components/ReviewCard';
import { currency } from '@/constants/currency';

export default function DishScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [dish, setDish] = useState(dishes.find(d => d.id === id));
  const [kitchen, setKitchen] = useState(dish ? kitchens.find(k => k.id === dish.kitchenId) : null);
  const [quantity, setQuantity] = useState(1);
  const [expandedOptions, setExpandedOptions] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{ [optionName: string]: string[] }>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  const { addToCart, kitchenId } = useCartStore();
  const { getReviewsForTarget, loadInitialReviews } = useReviewStore();
  
  // Get dish reviews
  const [dishReviews, setDishReviews] = useState(getReviewsForTarget(id, 'dish'));
  
  useEffect(() => {
    loadInitialReviews();
    setDishReviews(getReviewsForTarget(id, 'dish'));
  }, [id]);
  
  useEffect(() => {
    // Initialize selected options
    if (dish?.options) {
      const initialOptions: { [optionName: string]: string[] } = {};
      
      dish.options.forEach(option => {
        if (option.required) {
          // For required options, pre-select the first choice
          initialOptions[option.name] = [option.choices[0].id];
          // Auto-expand required options
          setExpandedOptions(prev => [...prev, option.name]);
        } else {
          initialOptions[option.name] = [];
        }
      });
      
      setSelectedOptions(initialOptions);
    }
  }, [dish]);
  
  const toggleOptionExpand = (optionName: string) => {
    setExpandedOptions(prev => 
      prev.includes(optionName)
        ? prev.filter(name => name !== optionName)
        : [...prev, optionName]
    );
  };
  
  const handleOptionSelect = (optionName: string, choiceId: string, multiple: boolean) => {
    setSelectedOptions(prev => {
      const current = prev[optionName] || [];
      
      if (multiple) {
        // For multiple selection options
        return {
          ...prev,
          [optionName]: current.includes(choiceId)
            ? current.filter(id => id !== choiceId)
            : [...current, choiceId]
        };
      } else {
        // For single selection options
        return {
          ...prev,
          [optionName]: [choiceId]
        };
      }
    });
  };
  
  const calculateTotalPrice = () => {
    if (!dish) return 0;
    
    let total = dish.price * quantity;
    
    // Add option prices
    Object.entries(selectedOptions).forEach(([optionName, selectedChoiceIds]) => {
      const option = dish.options?.find(opt => opt.name === optionName);
      if (option) {
        selectedChoiceIds.forEach(choiceId => {
          const choice = option.choices.find(c => c.id === choiceId);
          if (choice) {
            total += choice.price * quantity;
          }
        });
      }
    });
    
    return currency.symbol + currency.format(total);
  };
  
  const handleAddToCart = () => {
    if (!dish) return;
    
    // Check if all required options are selected
    const missingRequiredOptions = dish.options?.filter(option => 
      option.required && (!selectedOptions[option.name] || selectedOptions[option.name].length === 0)
    );
    
    if (missingRequiredOptions && missingRequiredOptions.length > 0) {
      Alert.alert(
        'Missing Options',
        `Please select options for: ${missingRequiredOptions.map(o => o.name).join(', ')}`
      );
      return;
    }
    
    // Check if adding from a different kitchen
    if (kitchenId && kitchenId !== dish.kitchenId) {
      Alert.alert(
        'Different Kitchen',
        'Your cart contains items from a different kitchen. Would you like to clear your cart and add this item?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Clear Cart & Add',
            onPress: () => {
              addToCart(dish, quantity, selectedOptions, specialInstructions);
              router.push('/cart');
            }
          }
        ]
      );
      return;
    }
    
    // Add to cart
    addToCart(dish, quantity, selectedOptions, specialInstructions);
    router.push('/cart');
  };
  
  const navigateToReviews = () => {
    router.push(`/reviews/dish/${id}`);
  };
  
  // Calculate average rating
  const averageRating = dishReviews.length > 0
    ? dishReviews.reduce((sum, review) => sum + review.rating, 0) / dishReviews.length
    : 0;
  
  if (!dish || !kitchen) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Dish not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: dish.image }} style={styles.dishImage} />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name}>{dish.name}</Text>
            
            <View style={styles.badgesContainer}>
              {dish.vegetarian && (
                <View style={[styles.badge, styles.vegBadge]}>
                  <Leaf size={14} color={colors.success} />
                  <Text style={[styles.badgeText, styles.vegBadgeText]}>Veg</Text>
                </View>
              )}
              
              {dish.spicy && (
                <View style={[styles.badge, styles.spicyBadge]}>
                  <Flame size={14} color={colors.error} />
                  <Text style={[styles.badgeText, styles.spicyBadgeText]}>Spicy</Text>
                </View>
              )}
            </View>
          </View>
          
          <Text style={styles.price}>{currency.symbol}{currency.format(dish.price)}</Text>
          
          <Pressable 
            style={styles.ratingContainer} 
            onPress={navigateToReviews}
          >
            <Star size={16} color={colors.warning} />
            <Text style={styles.ratingText}>
              {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'} 
              {dishReviews.length > 0 && ` (${dishReviews.length} reviews)`}
            </Text>
          </Pressable>
          
          <Text style={styles.description}>{dish.description}</Text>
          
          <Pressable 
            style={styles.kitchenButton}
            onPress={() => router.push(`/kitchen/${kitchen.id}`)}
          >
            <Image source={{ uri: kitchen.image }} style={styles.kitchenImage} />
            <Text style={styles.kitchenName}>By {kitchen.name}</Text>
          </Pressable>
          
          {dishReviews.length > 0 && (
            <View style={styles.reviewsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Reviews</Text>
                <Pressable onPress={navigateToReviews}>
                  <Text style={styles.viewAllText}>View All</Text>
                </Pressable>
              </View>
              
              <ReviewCard review={dishReviews[0]} />
              
              {dishReviews.length > 1 && (
                <Pressable style={styles.moreReviewsButton} onPress={navigateToReviews}>
                  <MessageSquare size={16} color={colors.primary} />
                  <Text style={styles.moreReviewsText}>
                    Read {dishReviews.length - 1} more reviews
                  </Text>
                </Pressable>
              )}
            </View>
          )}
          
          {dish.options && dish.options.length > 0 && (
            <View style={styles.optionsContainer}>
              <Text style={styles.optionsTitle}>Customize Your Order</Text>
              
              {dish.options.map(option => (
                <View key={option.name} style={styles.optionSection}>
                  <Pressable 
                    style={styles.optionHeader}
                    onPress={() => toggleOptionExpand(option.name)}
                  >
                    <View>
                      <Text style={styles.optionName}>
                        {option.name} {option.required && <Text style={styles.requiredText}>*</Text>}
                      </Text>
                      <Text style={styles.optionSubtitle}>
                        {option.multiple ? 'Select one or more' : 'Select one'}
                      </Text>
                    </View>
                    
                    {expandedOptions.includes(option.name) ? (
                      <ChevronUp size={20} color={colors.textLight} />
                    ) : (
                      <ChevronDown size={20} color={colors.textLight} />
                    )}
                  </Pressable>
                  
                  {expandedOptions.includes(option.name) && (
                    <View style={styles.choicesContainer}>
                      {option.choices.map(choice => {
                        const isSelected = selectedOptions[option.name]?.includes(choice.id);
                        
                        return (
                          <Pressable 
                            key={choice.id}
                            style={[
                              styles.choiceItem,
                              isSelected && styles.selectedChoiceItem
                            ]}
                            onPress={() => handleOptionSelect(option.name, choice.id, option.multiple)}
                          >
                            <View style={styles.choiceContent}>
                              <View style={styles.choiceCheckbox}>
                                {isSelected && <Check size={16} color={colors.primary} />}
                              </View>
                              
                              <View style={styles.choiceInfo}>
                                <Text style={styles.choiceName}>{choice.name}</Text>
                                {choice.price > 0 && (
                                  <Text style={styles.choicePrice}>+{currency.symbol}{currency.format(choice.price)}</Text>
                                )}
                              </View>
                            </View>
                          </Pressable>
                        );
                      })}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
          
          <View style={styles.specialInstructionsContainer}>
            <Text style={styles.specialInstructionsTitle}>Special Instructions</Text>
            <TextInput
              style={styles.specialInstructionsInput}
              placeholder="Add notes (allergies, special requests, etc.)"
              placeholderTextColor={colors.textExtraLight}
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              multiline
              numberOfLines={3}
            />
          </View>
          
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityTitle}>Quantity</Text>
            <QuantitySelector
              quantity={quantity}
              onIncrement={() => setQuantity(prev => prev + 1)}
              onDecrement={() => setQuantity(prev => Math.max(1, prev - 1))}
            />
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>{calculateTotalPrice()}</Text>
        </View>
        
        <Button
          title="Add to Cart"
          onPress={handleAddToCart}
          style={styles.addButton}
        />
      </View>
    </View>
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
  dishImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
    paddingBottom: 100, // Space for footer
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  vegBadge: {
    backgroundColor: colors.secondaryLight,
  },
  spicyBadge: {
    backgroundColor: colors.primaryLight,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  vegBadgeText: {
    color: colors.success,
  },
  spicyBadgeText: {
    color: colors.error,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 14,
    color: colors.textLight,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  kitchenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  kitchenImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  kitchenName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  reviewsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  moreReviewsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  moreReviewsText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  optionSection: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.gray,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  requiredText: {
    color: colors.error,
  },
  optionSubtitle: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  choicesContainer: {
    padding: 12,
  },
  choiceItem: {
    marginBottom: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  selectedChoiceItem: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '20',
  },
  choiceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  choiceCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  choiceInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  choiceName: {
    fontSize: 14,
    color: colors.text,
  },
  choicePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  specialInstructionsContainer: {
    marginBottom: 24,
  },
  specialInstructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  specialInstructionsInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginRight: 4,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  addButton: {
    flex: 1,
    marginLeft: 16,
  },
});