export interface Kitchen {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: string;
  categories: string[];
  featured: boolean;
  description: string;
}

export interface Dish {
  id: string;
  kitchenId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular: boolean;
  vegetarian: boolean;
  spicy: boolean;
  options?: DishOption[];
  rating?: number;
  reviewCount?: number;
}

export interface DishOption {
  name: string;
  choices: {
    id: string;
    name: string;
    price: number;
  }[];
  required: boolean;
  multiple: boolean;
}

export interface CartItem {
  dish: Dish;
  quantity: number;
  selectedOptions?: {
    [optionName: string]: string[];
  };
  specialInstructions?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled';
  total: number;
  deliveryAddress: string;
  deliveryTime: string;
  createdAt: string;
  kitchen: {
    id: string;
    name: string;
    image: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  address: string;
  default: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'wallet';
  last4?: string;
  brand?: string;
  default: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  targetId: string; // kitchenId or dishId
  targetType: 'kitchen' | 'dish';
  rating: number;
  text: string;
  date: string;
  photos?: string[];
  likes: number;
  orderId?: string;
}