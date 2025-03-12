import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Dish } from '@/types';
import { currency } from '@/constants/currency';

interface CartState {
  items: CartItem[];
  kitchenId: string | null;
  addToCart: (dish: Dish, quantity: number, selectedOptions?: { [optionName: string]: string[] }, specialInstructions?: string) => void;
  removeFromCart: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      kitchenId: null,
      
      addToCart: (dish, quantity, selectedOptions, specialInstructions) => {
        const { items, kitchenId } = get();
        
        // If cart is empty or items are from the same kitchen
        if (items.length === 0 || kitchenId === dish.kitchenId) {
          const existingItemIndex = items.findIndex(item => item.dish.id === dish.id);
          
          if (existingItemIndex !== -1) {
            // Update existing item
            const updatedItems = [...items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + quantity,
              selectedOptions: selectedOptions || updatedItems[existingItemIndex].selectedOptions,
              specialInstructions: specialInstructions || updatedItems[existingItemIndex].specialInstructions
            };
            
            set({ items: updatedItems });
          } else {
            // Add new item
            set({
              items: [...items, { dish, quantity, selectedOptions, specialInstructions }],
              kitchenId: dish.kitchenId
            });
          }
        } else {
          // Items are from a different kitchen, replace cart
          set({
            items: [{ dish, quantity, selectedOptions, specialInstructions }],
            kitchenId: dish.kitchenId
          });
        }
      },
      
      removeFromCart: (dishId) => {
        const { items } = get();
        const updatedItems = items.filter(item => item.dish.id !== dishId);
        
        set({
          items: updatedItems,
          kitchenId: updatedItems.length > 0 ? get().kitchenId : null
        });
      },
      
      updateQuantity: (dishId, quantity) => {
        const { items } = get();
        
        if (quantity <= 0) {
          get().removeFromCart(dishId);
          return;
        }
        
        const updatedItems = items.map(item => 
          item.dish.id === dishId ? { ...item, quantity } : item
        );
        
        set({ items: updatedItems });
      },
      
      clearCart: () => {
        set({ items: [], kitchenId: null });
      },
      
      getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          let itemTotal = item.dish.price * item.quantity;
          
          // Add option prices if any
          if (item.selectedOptions) {
            Object.entries(item.selectedOptions).forEach(([optionName, selectedChoiceIds]) => {
              const option = item.dish.options?.find(opt => opt.name === optionName);
              if (option) {
                selectedChoiceIds.forEach(choiceId => {
                  const choice = option.choices.find(c => c.id === choiceId);
                  if (choice) {
                    itemTotal += choice.price * item.quantity;
                  }
                });
              }
            });
          }
          
          return total + itemTotal;
        }, 0);
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);