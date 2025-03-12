import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Clock, Check, ChevronRight, Phone, MessageSquare } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useOrderStore } from '@/store/order-store';
import { Button } from '@/components/Button';
import { currency } from '@/constants/currency';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getOrderById, cancelOrder } = useOrderStore();
  const [order, setOrder] = useState(getOrderById(id));
  
  useEffect(() => {
    // Refresh order data when the component mounts
    setOrder(getOrderById(id));
  }, [id]);
  
  const handleCancelOrder = () => {
    if (order) {
      cancelOrder(order.id);
      setOrder(getOrderById(order.id));
    }
  };
  
  const getStatusStepNumber = (status: string) => {
    const statusOrder = ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered'];
    return statusOrder.indexOf(status) + 1;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };
  
  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Order not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.kitchenInfo}>
            <Image source={{ uri: order.kitchen.image }} style={styles.kitchenImage} />
            <View>
              <Text style={styles.kitchenName}>{order.kitchen.name}</Text>
              <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
            </View>
          </View>
          
          <View style={[
            styles.statusBadge, 
            { backgroundColor: getStatusColor(order.status) + '20' }
          ]}>
            <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
              {getStatusText(order.status)}
            </Text>
          </View>
        </View>
        
        {order.status !== 'cancelled' && order.status !== 'delivered' && (
          <View style={styles.trackingContainer}>
            <Text style={styles.trackingTitle}>Order Status</Text>
            
            <View style={styles.stepsContainer}>
              <View style={styles.stepsLine} />
              
              {['Confirmed', 'Preparing', 'Ready', 'On the way', 'Delivered'].map((step, index) => {
                const stepNumber = index + 1;
                const isCompleted = getStatusStepNumber(order.status) > stepNumber;
                const isCurrent = getStatusStepNumber(order.status) === stepNumber;
                
                return (
                  <View key={step} style={styles.stepItem}>
                    <View style={[
                      styles.stepCircle,
                      isCompleted && styles.completedStepCircle,
                      isCurrent && styles.currentStepCircle
                    ]}>
                      {isCompleted ? (
                        <Check size={16} color={colors.white} />
                      ) : (
                        <Text style={[
                          styles.stepNumber,
                          isCurrent && styles.currentStepNumber
                        ]}>
                          {stepNumber}
                        </Text>
                      )}
                    </View>
                    <Text style={[
                      styles.stepText,
                      (isCompleted || isCurrent) && styles.activeStepText
                    ]}>
                      {step}
                    </Text>
                  </View>
                );
              })}
            </View>
            
            <View style={styles.deliveryTimeContainer}>
              <Clock size={16} color={colors.textLight} />
              <Text style={styles.deliveryTimeText}>
                Estimated delivery: {order.deliveryTime}
              </Text>
            </View>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressContainer}>
            <MapPin size={16} color={colors.primary} />
            <Text style={styles.addressText}>{order.deliveryAddress}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          
          {order.items.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <View style={styles.orderItemHeader}>
                <Text style={styles.orderItemQuantity}>{item.quantity}x</Text>
                <Text style={styles.orderItemName}>{item.dish.name}</Text>
              </View>
              
              {item.selectedOptions && Object.entries(item.selectedOptions).map(([optionName, selectedChoiceIds]) => {
                const option = item.dish.options?.find(opt => opt.name === optionName);
                if (!option) return null;
                
                const choiceNames = selectedChoiceIds.map(choiceId => {
                  const choice = option.choices.find(c => c.id === choiceId);
                  return choice?.name;
                }).filter(Boolean).join(', ');
                
                return (
                  <Text key={optionName} style={styles.orderItemOption}>
                    {optionName}: {choiceNames}
                  </Text>
                );
              })}
              
              {item.specialInstructions && (
                <Text style={styles.orderItemSpecial}>
                  Note: {item.specialInstructions}
                </Text>
              )}
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              {currency.symbol}{currency.format(order.total * 0.8)}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>
              {currency.symbol}{currency.format(order.total * 0.1)}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax & Fees</Text>
            <Text style={styles.summaryValue}>
              {currency.symbol}{currency.format(order.total * 0.1)}
            </Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{currency.symbol}{currency.format(order.total)}</Text>
          </View>
        </View>
        
        {order.status !== 'delivered' && order.status !== 'cancelled' && (
          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Need Help?</Text>
            
            <View style={styles.actionButtons}>
              <Pressable style={styles.actionButton}>
                <Phone size={20} color={colors.primary} />
                <Text style={styles.actionButtonText}>Call Kitchen</Text>
              </Pressable>
              
              <Pressable style={styles.actionButton}>
                <MessageSquare size={20} color={colors.primary} />
                <Text style={styles.actionButtonText}>Support Chat</Text>
              </Pressable>
            </View>
            
            {['pending', 'confirmed'].includes(order.status) && (
              <Button
                title="Cancel Order"
                onPress={handleCancelOrder}
                variant="outline"
                style={styles.cancelButton}
                textStyle={{ color: colors.error }}
              />
            )}
          </View>
        )}
        
        {order.status === 'delivered' && (
          <View style={styles.actionsContainer}>
            <Button
              title="Reorder"
              onPress={() => router.push(`/kitchen/${order.kitchen.id}`)}
              style={styles.reorderButton}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'pending':
      return colors.warning;
    case 'confirmed':
    case 'preparing':
    case 'ready':
    case 'out-for-delivery':
      return colors.info;
    case 'delivered':
      return colors.success;
    case 'cancelled':
      return colors.error;
    default:
      return colors.textLight;
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'confirmed':
      return 'Confirmed';
    case 'preparing':
      return 'Preparing';
    case 'ready':
      return 'Ready';
    case 'out-for-delivery':
      return 'Out for delivery';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  kitchenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kitchenImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  kitchenName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  orderDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  trackingContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  trackingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  stepsContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  stepsLine: {
    position: 'absolute',
    left: 12,
    top: 12,
    bottom: 12,
    width: 2,
    backgroundColor: colors.grayDark,
    zIndex: 1,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    zIndex: 2,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.grayDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  completedStepCircle: {
    backgroundColor: colors.success,
  },
  currentStepCircle: {
    backgroundColor: colors.primary,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  currentStepNumber: {
    color: colors.white,
  },
  stepText: {
    fontSize: 14,
    color: colors.textLight,
  },
  activeStepText: {
    color: colors.text,
    fontWeight: '600',
  },
  deliveryTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  deliveryTimeText: {
    fontSize: 14,
    color: colors.text,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  addressText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  orderItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  orderItemHeader: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  orderItemQuantity: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginRight: 8,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  orderItemOption: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 24,
    marginTop: 2,
  },
  orderItemSpecial: {
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.textLight,
    marginLeft: 24,
    marginTop: 4,
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
  actionsContainer: {
    padding: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight + '20',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  cancelButton: {
    borderColor: colors.error,
  },
  reorderButton: {
    width: '100%',
  },
});