import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Address, PaymentMethod, User } from '@/types';

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (addressId: string, addressData: Partial<Address>) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  addPaymentMethod: (paymentMethod: Omit<PaymentMethod, 'id'>) => void;
  removePaymentMethod: (paymentMethodId: string) => void;
  setDefaultPaymentMethod: (paymentMethodId: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      
      login: (user) => {
        set({ user, isLoggedIn: true });
      },
      
      logout: () => {
        set({ user: null, isLoggedIn: false });
      },
      
      updateUser: (userData) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },
      
      addAddress: (address) => {
        const { user } = get();
        if (user) {
          const newAddress = {
            ...address,
            id: Date.now().toString(),
            default: user.addresses.length === 0 ? true : address.default || false
          };
          
          // If this is set as default, update other addresses
          const updatedAddresses = newAddress.default
            ? user.addresses.map(addr => ({ ...addr, default: false }))
            : [...user.addresses];
          
          set({
            user: {
              ...user,
              addresses: [...updatedAddresses, newAddress]
            }
          });
        }
      },
      
      updateAddress: (addressId, addressData) => {
        const { user } = get();
        if (user) {
          const updatedAddresses = user.addresses.map(address => 
            address.id === addressId ? { ...address, ...addressData } : address
          );
          
          set({
            user: {
              ...user,
              addresses: updatedAddresses
            }
          });
        }
      },
      
      removeAddress: (addressId) => {
        const { user } = get();
        if (user) {
          const updatedAddresses = user.addresses.filter(address => address.id !== addressId);
          
          // If we removed the default address, set a new default if possible
          if (user.addresses.find(addr => addr.id === addressId)?.default && updatedAddresses.length > 0) {
            updatedAddresses[0].default = true;
          }
          
          set({
            user: {
              ...user,
              addresses: updatedAddresses
            }
          });
        }
      },
      
      setDefaultAddress: (addressId) => {
        const { user } = get();
        if (user) {
          const updatedAddresses = user.addresses.map(address => ({
            ...address,
            default: address.id === addressId
          }));
          
          set({
            user: {
              ...user,
              addresses: updatedAddresses
            }
          });
        }
      },
      
      addPaymentMethod: (paymentMethod) => {
        const { user } = get();
        if (user) {
          const newPaymentMethod = {
            ...paymentMethod,
            id: Date.now().toString(),
            default: user.paymentMethods.length === 0 ? true : paymentMethod.default || false
          };
          
          // If this is set as default, update other payment methods
          const updatedPaymentMethods = newPaymentMethod.default
            ? user.paymentMethods.map(method => ({ ...method, default: false }))
            : [...user.paymentMethods];
          
          set({
            user: {
              ...user,
              paymentMethods: [...updatedPaymentMethods, newPaymentMethod]
            }
          });
        }
      },
      
      removePaymentMethod: (paymentMethodId) => {
        const { user } = get();
        if (user) {
          const updatedPaymentMethods = user.paymentMethods.filter(method => method.id !== paymentMethodId);
          
          // If we removed the default payment method, set a new default if possible
          if (user.paymentMethods.find(method => method.id === paymentMethodId)?.default && updatedPaymentMethods.length > 0) {
            updatedPaymentMethods[0].default = true;
          }
          
          set({
            user: {
              ...user,
              paymentMethods: updatedPaymentMethods
            }
          });
        }
      },
      
      setDefaultPaymentMethod: (paymentMethodId) => {
        const { user } = get();
        if (user) {
          const updatedPaymentMethods = user.paymentMethods.map(method => ({
            ...method,
            default: method.id === paymentMethodId
          }));
          
          set({
            user: {
              ...user,
              paymentMethods: updatedPaymentMethods
            }
          });
        }
      }
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);