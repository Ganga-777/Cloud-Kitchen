import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingBag } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useCartStore } from '@/store/cart-store';
import { CartItem } from '@/components/CartItem';
import { Button } from '@/components/Button';
import { useRouter } from 'expo-router';
import { kitchens } from '@/mocks/kitchens';
import { currency } from '@/constants/currency';

export default function CartScreen() {
  const { items, kitchenId, clearCart, getCartTotal } = useCartStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const kitchen = kitchens.find(k => k.id === kitchenId);
  const cartTotal = getCartTotal();
  const deliveryFee = kitchen ? parseFloat(kitchen.deliveryFee.replace('$', '')) : 0;
  const serviceFee = cartTotal * 0.05; // 5% service fee
  const tax = cartTotal * 0.08; // 8% tax
  const totalAmount = cartTotal + deliveryFee + serviceFee + tax;
  
  const handleCheckout = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push('/checkout');
    }, 1000);
  };
  
  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear your cart?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear',
          onPress: () => clearCart(),
          style: 'destructive'
        }
      ]
    );
  };
  
  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.emptyContainer}>
          <ShoppingBag size={64} color={colors.textLight} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add items to your cart to place an order</Text>
          <Button 
            title="Browse Kitchens" 
            onPress={() => router.push('/')}
            style={styles.browseButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {kitchen && (
          <View style={styles.kitchenInfo}>
            <Text style={styles.kitchenTitle}>Order from</Text>
            <Text style={styles.kitchenName}>{kitchen.name}</Text>
          </View>
        )}
        
        <View style={styles.itemsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Items</Text>
            <Button 
              title="Clear Cart" 
              onPress={handleClearCart}
              variant="ghost"
              size="small"
              textStyle={{ color: colors.error }}
            />
          </View>
          
          {items.map(item => (
            <CartItem key={item.dish.id} item={item} />
          ))}
        </View>
        
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{currency.symbol}{currency.format(cartTotal)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>{currency.symbol}{currency.format(deliveryFee)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service Fee</Text>
            <Text style={styles.summaryValue}>{currency.symbol}{currency.format(serviceFee)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>{currency.symbol}{currency.format(tax)}</Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{currency.symbol}{currency.format(totalAmount)}</Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Proceed to Checkout"
          onPress={handleCheckout}
          style={styles.checkoutButton}
          loading={isLoading}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    width: '100%',
  },
  kitchenInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  kitchenTitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  kitchenName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  itemsContainer: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: colors.gray,
    marginBottom: 80, // Space for footer
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
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
  },
  checkoutButton: {
    width: '100%',
  },
});