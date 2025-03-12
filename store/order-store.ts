import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order } from '@/types';
import { orders as mockOrders } from '@/mocks/orders';

interface OrderState {
  orders: Order[];
  activeOrder: Order | null;
  placeOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Order;
  getOrderById: (orderId: string) => Order | undefined;
  cancelOrder: (orderId: string) => void;
  loadInitialOrders: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      activeOrder: null,
      
      placeOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
          createdAt: new Date().toISOString(),
          status: 'pending'
        };
        
        set(state => ({
          orders: [newOrder, ...state.orders],
          activeOrder: newOrder
        }));
        
        return newOrder;
      },
      
      getOrderById: (orderId) => {
        return get().orders.find(order => order.id === orderId);
      },
      
      cancelOrder: (orderId) => {
        set(state => ({
          orders: state.orders.map(order => 
            order.id === orderId ? { ...order, status: 'cancelled' } : order
          ),
          activeOrder: state.activeOrder?.id === orderId 
            ? { ...state.activeOrder, status: 'cancelled' } 
            : state.activeOrder
        }));
      },
      
      loadInitialOrders: () => {
        // Only load mock orders if there are no orders yet
        if (get().orders.length === 0) {
          set({ orders: mockOrders });
        }
      }
    }),
    {
      name: 'order-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);