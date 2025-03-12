import { Dish } from '@/types';

export const dishes: Dish[] = [
  // Mom's Homestyle Kitchen
  {
    id: '101',
    kitchenId: '1',
    name: "Mom's Special Butter Chicken",
    description: "Tender chicken cooked in a rich, creamy tomato sauce with a blend of aromatic spices.",
    price: 349,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Main Course",
    popular: true,
    vegetarian: false,
    spicy: true,
    options: [
      {
        name: "Spice Level",
        choices: [
          { id: "mild", name: "Mild", price: 0 },
          { id: "medium", name: "Medium", price: 0 },
          { id: "hot", name: "Hot", price: 0 }
        ],
        required: true,
        multiple: false
      },
      {
        name: "Add-ons",
        choices: [
          { id: "naan", name: "Butter Naan", price: 49 },
          { id: "rice", name: "Basmati Rice", price: 79 },
          { id: "raita", name: "Cucumber Raita", price: 39 }
        ],
        required: false,
        multiple: true
      }
    ]
  },
  {
    id: '102',
    kitchenId: '1',
    name: "Homestyle Dal Makhani",
    description: "Black lentils and kidney beans slow-cooked with butter and cream, finished with a touch of garam masala.",
    price: 249,
    image: "https://images.unsplash.com/photo-1546833998-877b37c2e4c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Main Course",
    popular: true,
    vegetarian: true,
    spicy: false,
    options: [
      {
        name: "Add-ons",
        choices: [
          { id: "naan", name: "Butter Naan", price: 49 },
          { id: "rice", name: "Basmati Rice", price: 79 },
          { id: "papad", name: "Papad", price: 29 }
        ],
        required: false,
        multiple: true
      }
    ]
  },
  {
    id: '103',
    kitchenId: '1',
    name: "Paneer Tikka Masala",
    description: "Grilled cottage cheese cubes in a spiced tomato gravy, garnished with fresh cream and coriander.",
    price: 299,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Main Course",
    popular: false,
    vegetarian: true,
    spicy: true,
    options: [
      {
        name: "Spice Level",
        choices: [
          { id: "mild", name: "Mild", price: 0 },
          { id: "medium", name: "Medium", price: 0 },
          { id: "hot", name: "Hot", price: 0 }
        ],
        required: true,
        multiple: false
      }
    ]
  },
  {
    id: '104',
    kitchenId: '1',
    name: "Chicken Biryani",
    description: "Fragrant basmati rice layered with marinated chicken and aromatic spices, slow-cooked to perfection.",
    price: 399,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Rice",
    popular: true,
    vegetarian: false,
    spicy: true
  },
  
  // Urban Bowls
  {
    id: '201',
    kitchenId: '2',
    name: "Protein Power Bowl",
    description: "Quinoa, grilled chicken, avocado, black beans, corn, cherry tomatoes, and lime-cilantro dressing.",
    price: 329,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Bowls",
    popular: true,
    vegetarian: false,
    spicy: false,
    options: [
      {
        name: "Protein",
        choices: [
          { id: "chicken", name: "Grilled Chicken", price: 0 },
          { id: "tofu", name: "Tofu", price: 0 },
          { id: "shrimp", name: "Shrimp", price: 59 }
        ],
        required: true,
        multiple: false
      },
      {
        name: "Dressing",
        choices: [
          { id: "lime", name: "Lime-Cilantro", price: 0 },
          { id: "ranch", name: "Avocado Ranch", price: 0 },
          { id: "tahini", name: "Lemon Tahini", price: 0 }
        ],
        required: true,
        multiple: false
      }
    ]
  },
  {
    id: '202',
    kitchenId: '2',
    name: "Mediterranean Bowl",
    description: "Falafel, hummus, tabbouleh, cucumber, cherry tomatoes, olives, and tzatziki sauce on a bed of mixed greens.",
    price: 299,
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Bowls",
    popular: false,
    vegetarian: true,
    spicy: false
  },
  
  // Pasta Paradise
  {
    id: '401',
    kitchenId: '4',
    name: "Classic Spaghetti Carbonara",
    description: "Al dente spaghetti tossed with crispy pancetta, eggs, Pecorino Romano, and freshly ground black pepper.",
    price: 349,
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Pasta",
    popular: true,
    vegetarian: false,
    spicy: false,
    options: [
      {
        name: "Add-ons",
        choices: [
          { id: "chicken", name: "Grilled Chicken", price: 79 },
          { id: "shrimp", name: "Garlic Shrimp", price: 99 },
          { id: "bread", name: "Garlic Bread", price: 59 }
        ],
        required: false,
        multiple: true
      }
    ]
  },
  
  // Burger Cloud
  {
    id: '701',
    kitchenId: '7',
    name: "Classic Cheeseburger",
    description: "Juicy beef patty with melted cheddar, lettuce, tomato, onion, and our special sauce on a toasted brioche bun.",
    price: 279,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Burgers",
    popular: true,
    vegetarian: false,
    spicy: false,
    options: [
      {
        name: "Patty",
        choices: [
          { id: "single", name: "Single", price: 0 },
          { id: "double", name: "Double", price: 79 }
        ],
        required: true,
        multiple: false
      },
      {
        name: "Sides",
        choices: [
          { id: "fries", name: "French Fries", price: 59 },
          { id: "onion", name: "Onion Rings", price: 69 },
          { id: "salad", name: "Side Salad", price: 59 }
        ],
        required: false,
        multiple: true
      }
    ]
  }
];