import { Review } from '@/types';

export const reviews: Review[] = [
  // Kitchen reviews
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    targetId: '1', // Mom's Homestyle Kitchen
    targetType: 'kitchen',
    rating: 5,
    text: "Absolutely love this place! The food tastes just like my grandmother used to make. Every dish is packed with flavor and the portions are generous. I've ordered multiple times and have never been disappointed.",
    date: '2023-05-15T14:30:00Z',
    likes: 12,
    orderId: 'ORD-001'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Sarah Johnson',
    targetId: '1', // Mom's Homestyle Kitchen
    targetType: 'kitchen',
    rating: 4,
    text: "Great food and quick delivery. The butter chicken is amazing! Would give 5 stars but my order was missing naan once. They quickly resolved it though.",
    date: '2023-05-20T18:45:00Z',
    likes: 8,
    orderId: 'ORD-002'
  },
  {
    id: '3',
    userId: '3',
    userName: 'Michael Chen',
    targetId: '1', // Mom's Homestyle Kitchen
    targetType: 'kitchen',
    rating: 5,
    text: "Best Indian food in the area! The flavors are authentic and the quality is consistent. Highly recommend the Dal Makhani and Paneer Tikka Masala.",
    date: '2023-06-05T20:15:00Z',
    photos: [
      'https://images.unsplash.com/photo-1585937421612-70a008356c36?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    likes: 15,
    orderId: 'ORD-003'
  },
  
  // Dish reviews
  {
    id: '4',
    userId: '4',
    userName: 'Emily Wilson',
    targetId: '101', // Mom's Special Butter Chicken
    targetType: 'dish',
    rating: 5,
    text: "This butter chicken is to die for! Creamy, flavorful, and the perfect level of spice. I get it at least once a week.",
    date: '2023-06-10T12:30:00Z',
    likes: 7,
    orderId: 'ORD-004'
  },
  {
    id: '5',
    userId: '5',
    userName: 'David Thompson',
    targetId: '101', // Mom's Special Butter Chicken
    targetType: 'dish',
    rating: 4,
    text: "Really good butter chicken. The sauce is rich and flavorful. I just wish they'd give a bit more chicken in the portion.",
    date: '2023-06-12T19:20:00Z',
    likes: 3,
    orderId: 'ORD-005'
  },
  {
    id: '6',
    userId: '6',
    userName: 'Lisa Garcia',
    targetId: '102', // Homestyle Dal Makhani
    targetType: 'dish',
    rating: 5,
    text: "As a vegetarian, this is my go-to dish. The lentils are cooked perfectly and the flavor is incredible. Pairs perfectly with their naan!",
    date: '2023-06-15T21:10:00Z',
    photos: [
      'https://images.unsplash.com/photo-1546833998-877b37c2e4c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    likes: 9,
    orderId: 'ORD-006'
  },
  
  // More kitchen reviews
  {
    id: '7',
    userId: '7',
    userName: 'Robert Kim',
    targetId: '2', // Urban Bowls
    targetType: 'kitchen',
    rating: 5,
    text: "Urban Bowls has become my favorite lunch spot! The ingredients are always fresh and the combinations are creative. Love the protein power bowl!",
    date: '2023-06-18T13:45:00Z',
    likes: 11,
    orderId: 'ORD-007'
  },
  {
    id: '8',
    userId: '8',
    userName: 'Jennifer Lee',
    targetId: '4', // Pasta Paradise
    targetType: 'kitchen',
    rating: 4,
    text: "The pasta is freshly made and you can taste the difference. The carbonara is exceptional! Delivery was a bit slow though.",
    date: '2023-06-20T20:30:00Z',
    likes: 6,
    orderId: 'ORD-008'
  },
  
  // More dish reviews
  {
    id: '9',
    userId: '9',
    userName: 'Thomas Wright',
    targetId: '201', // Protein Power Bowl
    targetType: 'dish',
    rating: 5,
    text: "Perfect post-workout meal! Packed with protein and tastes amazing. The lime-cilantro dressing is a game-changer.",
    date: '2023-06-22T15:20:00Z',
    photos: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    likes: 14,
    orderId: 'ORD-009'
  },
  {
    id: '10',
    userId: '10',
    userName: 'Amanda Martinez',
    targetId: '401', // Classic Spaghetti Carbonara
    targetType: 'dish',
    rating: 5,
    text: "This carbonara is as good as what I had in Italy! The pasta is perfectly al dente and the sauce is creamy without being heavy. Definitely recommend!",
    date: '2023-06-25T19:15:00Z',
    likes: 10,
    orderId: 'ORD-010'
  }
];