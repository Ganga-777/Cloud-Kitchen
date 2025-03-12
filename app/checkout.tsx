import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, CreditCard, Clock, ChevronRight, Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useCartStore } from '@/store/cart-store';
import { useUserStore } from '@/store/user-store';
import { useOrderStore } from '@/store/order-store';
import { Button } from '@/components/Button';
import { useRouter } from 'expo-router';
import { kitchens } from '@/mocks/kitchens';
import { currency } from '@/constants/currency';

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, kitchenId, getCartTotal, clearCart } = useCartStore();
  const { user } = useUserStore();
  const { placeOrder } = useOrderStore();
  
  const [selectedAddressId, setSelectedAddressId] = useState(
    user?.addresses.find(addr => addr.default)?.id || user?.addresses[0]?.id
  );
  
  const [selectedPaymentId, setSelectedPaymentId] = useState(
    user?.paymentMethods.find(method => method.default)?.id || user?.paymentMethods[0]?.id
  );
  
  const [deliveryTime, setDeliveryTime] = useState('asap');
  const [isLoading, setIsLoading] = useState(false);
  
  const kitchen = kitchens.find(k => k.id === kitchenId);
  const cartTotal = getCartTotal();
  const deliveryFee = kitchen ? parseFloat(kitchen.deliveryFee.replace('$', '')) : 0;
  const serviceFee = cartTotal * 0.05; // 5% service fee
  const tax = cartTotal * 0.08; // 8% tax
  const totalAmount = cartTotal + deliveryFee + serviceFee + tax;
  
  const selectedAddress = user?.addresses.find(addr => addr.id === selectedAddressId);
  const selectedPayment = user?.paymentMethods.find(method => method.id === selectedPaymentId);
  
  const handlePlaceOrder = () => {
    if (!kitchen || !selectedAddress) {
      Alert.alert('Error', 'Please select a delivery address');
      return;
    }
    
    if (!selectedPayment) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newOrder = placeOrder({
        items,
        status: 'confirmed',
        total: totalAmount,
        deliveryAddress: selectedAddress.address,
        deliveryTime: kitchen.deliveryTime,
        kitchen: {
          id: kitchen.id,
          name: kitchen.name,
          image: kitchen.image
        }
      });
      
      clearCart();
      setIsLoading(false);
      
      router.replace(`/order/${newOrder.id}`);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <MapPin size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Delivery Address</Text>
            </View>
            <Pressable>
              <Text style={styles.changeText}>Change</Text>
            </Pressable>
          </View>
          
          {user?.addresses.map(address => (
            <Pressable 
              key={address.id}
              style={[
                styles.addressItem,
                selectedAddressId === address.id && styles.selectedItem
              ]}
              onPress={() => setSelectedAddressId(address.id)}
            >
              <View style={styles.addressContent}>
                <View style={styles.addressHeader}>
                  <Text style={styles.addressType}>{address.type.toUpperCase()}</Text>
                  {selectedAddressId === address.id && (
                    <Check size={16} color={colors.primary} />
                  )}
                </View>
                <Text style={styles.addressText}>{address.address}</Text>
              </View>
            </Pressable>
          ))}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <CreditCard size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Payment Method</Text>
            </View>
            <Pressable>
              <Text style={styles.changeText}>Change</Text>
            </Pressable>
          </View>
          
          {user?.paymentMethods.map(method => (
            <Pressable 
              key={method.id}
              style={[
                styles.paymentItem,
                selectedPaymentId === method.id && styles.selectedItem
              ]}
              onPress={() => setSelectedPaymentId(method.id)}
            >
              <View style={styles.paymentContent}>
                <View style={styles.paymentHeader}>
                  <Text style={styles.paymentType}>
                    {method.type === 'card' ? `${method.brand} •••• ${method.last4}` : method.type.toUpperCase()}
                  </Text>
                  {selectedPaymentId === method.id && (
                    <Check size={16} color={colors.primary} />
                  )}
                </View>
                {method.default && (
                  <Text style={styles.defaultText}>Default</Text>
                )}
              </View>
            </Pressable>
          ))}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Clock size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Delivery Time</Text>
            </View>
          </View>
          
          <Pressable 
            style={[
              styles.timeItem,
              deliveryTime === 'asap' && styles.selectedItem
            ]}
            onPress={() => setDeliveryTime('asap')}
          >
            <Text style={styles.timeText}>As soon as possible</Text>
            {deliveryTime === 'asap' && (
              <Check size={16} color={colors.primary} />
            )}
          </Pressable>
          
          <Pressable 
            style={[
              styles.timeItem,
              deliveryTime === 'scheduled' && styles.selectedItem
            ]}
            onPress={() => setDeliveryTime('scheduled')}
          >
            <Text style={styles.timeText}>Schedule for later</Text>
            {deliveryTime === 'scheduled' && (
              <Check size={16} color={colors.primary} />
            )}
          </Pressable>
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
          title="Place Order"
          onPress={handlePlaceOrder}
          style={styles.placeOrderButton}
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
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  changeText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  addressItem: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  selectedItem: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '10',
  },
  addressContent: {},
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressType: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textLight,
  },
  addressText: {
    fontSize: 14,
    color: colors.text,
  },
  paymentItem: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  paymentContent: {},
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentType: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  defaultText: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  timeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  timeText: {
    fontSize: 14,
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
  placeOrderButton: {
    width: '100%',
  },
});