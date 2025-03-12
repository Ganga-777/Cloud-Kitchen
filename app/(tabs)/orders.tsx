import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClipboardList } from 'lucide-react-native';
import { OrderCard } from '@/components/OrderCard';
import { useOrderStore } from '@/store/order-store';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { useRouter } from 'expo-router';

export default function OrdersScreen() {
  const { orders, loadInitialOrders } = useOrderStore();
  const router = useRouter();
  
  useEffect(() => {
    loadInitialOrders();
  }, []);
  
  const activeOrders = orders.filter(order => 
    ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery'].includes(order.status)
  );
  
  const pastOrders = orders.filter(order => 
    ['delivered', 'cancelled'].includes(order.status)
  );
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <ClipboardList size={48} color={colors.textLight} />
      <Text style={styles.emptyTitle}>No orders yet</Text>
      <Text style={styles.emptyText}>Your order history will appear here</Text>
      <Button 
        title="Browse Kitchens" 
        onPress={() => router.push('/')}
        style={styles.browseButton}
      />
    </View>
  );

  if (orders.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        {renderEmptyState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={[]}
        ListHeaderComponent={() => (
          <>
            {activeOrders.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Active Orders</Text>
                {activeOrders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </View>
            )}
            
            {pastOrders.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Past Orders</Text>
                {pastOrders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </View>
            )}
          </>
        )}
        ListFooterComponent={<View style={{ height: 20 }} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
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
    marginTop: 16,
  },
});