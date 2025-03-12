import { Order } from '@/types';
import { dishes } from './dishes';

export const orders: Order[] = [
  {
    id: 'ORD-001',
    items: [
      {
        dish: dishes.find(dish => dish.id === '101')!,
        quantity: 1,
        selectedOptions: {
          'Spice Level': ['medium'],
          'Add-ons': ['naan', 'rice']
        }
      },
      {
        dish: dishes.find(dish => dish.id === '102')!,
        quantity: 1
      }
    ],
    status: 'delivered',
    total: 33.96,
    deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001',
    deliveryTime: '25-35 min',
    createdAt: '2023-06-15T18:30:00Z',
    kitchen: {
      id: '1',
      name: "Mom's Homestyle Kitchen",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    id: 'ORD-002',
    items: [
      {
        dish: dishes.find(dish => dish.id === '201')!,
        quantity: 2,
        selectedOptions: {
          'Protein': ['chicken'],
          'Dressing': ['lime']
        }
      }
    ],
    status: 'out-for-delivery',
    total: 27.98,
    deliveryAddress: '456 Park Ave, New York, NY 10022',
    deliveryTime: '15-25 min',
    createdAt: '2023-06-20T12:45:00Z',
    kitchen: {
      id: '2',
      name: "Urban Bowls",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    id: 'ORD-003',
    items: [
      {
        dish: dishes.find(dish => dish.id === '701')!,
        quantity: 1,
        selectedOptions: {
          'Patty': ['double'],
          'Sides': ['fries', 'onion']
        }
      }
    ],
    status: 'preparing',
    total: 19.47,
    deliveryAddress: '789 Broadway, New York, NY 10003',
    deliveryTime: '20-30 min',
    createdAt: '2023-06-22T19:15:00Z',
    kitchen: {
      id: '7',
      name: "Burger Cloud",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  }
];