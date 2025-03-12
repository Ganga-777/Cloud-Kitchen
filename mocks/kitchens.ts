import { Kitchen } from '@/types';

export const kitchens: Kitchen[] = [
  {
    id: '1',
    name: "Mom's Homestyle Kitchen",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewCount: 342,
    deliveryTime: '25-35 min',
    deliveryFee: '₹49',
    categories: ['Indian', 'Homestyle', 'Comfort Food'],
    featured: true,
    description: "Authentic homemade dishes just like mom used to make. Our recipes have been passed down through generations."
  },
  {
    id: '2',
    name: "Urban Bowls",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    reviewCount: 218,
    deliveryTime: '15-25 min',
    deliveryFee: '₹59',
    categories: ['Healthy', 'Bowls', 'Salads'],
    featured: true,
    description: "Nutritious and delicious bowls packed with fresh ingredients. Perfect for health-conscious food lovers."
  },
  {
    id: '3',
    name: "Spice Route",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviewCount: 189,
    deliveryTime: '30-40 min',
    deliveryFee: '₹39',
    categories: ['Indian', 'Curry', 'Spicy'],
    featured: false,
    description: "Authentic Indian cuisine with a modern twist. Our spices are freshly ground for maximum flavor."
  },
  {
    id: '4',
    name: "Pasta Paradise",
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    reviewCount: 156,
    deliveryTime: '20-30 min',
    deliveryFee: '₹69',
    categories: ['Italian', 'Pasta', 'Pizza'],
    featured: true,
    description: "Handcrafted pasta made fresh daily. Our sauces simmer for hours to develop rich, complex flavors."
  },
  {
    id: '5',
    name: "Sushi Cloud",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewCount: 203,
    deliveryTime: '25-35 min',
    deliveryFee: '₹79',
    categories: ['Japanese', 'Sushi', 'Asian'],
    featured: false,
    description: "Premium sushi prepared by experienced chefs using the freshest ingredients available."
  },
  {
    id: '6',
    name: "Taco Factory",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.4,
    reviewCount: 178,
    deliveryTime: '15-25 min',
    deliveryFee: '₹49',
    categories: ['Mexican', 'Tacos', 'Burritos'],
    featured: false,
    description: "Authentic Mexican street food made with traditional recipes and techniques."
  },
  {
    id: '7',
    name: "Burger Cloud",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.3,
    reviewCount: 245,
    deliveryTime: '20-30 min',
    deliveryFee: '₹59',
    categories: ['American', 'Burgers', 'Fast Food'],
    featured: true,
    description: "Juicy, handcrafted burgers made with premium ingredients and our secret sauce."
  },
  {
    id: '8',
    name: "Green Leaf",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviewCount: 132,
    deliveryTime: '15-25 min',
    deliveryFee: '₹69',
    categories: ['Vegan', 'Healthy', 'Salads'],
    featured: false,
    description: "Plant-based dishes that don't compromise on flavor. Good for you and the planet."
  }
];