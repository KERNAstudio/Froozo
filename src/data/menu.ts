export type MenuItem = {
  name: string;
  detail?: string;
  featured?: boolean;
};

export type MenuCategory = {
  id: string;
  title: string;
  note?: string;
  items: MenuItem[];
};

export const menu: MenuCategory[] = [
  {
    id: "pizza",
    title: "Pizza",
    note: "Jain options available on request.",
    items: [
      { name: "Margherita", detail: "Only cheese" },
      { name: "Classic Veg", detail: "Onion, capsicum, tomato" },
      { name: "Exotic Veg", detail: "Onion, capsicum, jalapeno, olives" },
      { name: "Farm House", detail: "Onion, capsicum, tomato, corn" },
      { name: "Hawaiian Fantasy", detail: "Onion, corn, pineapple, olives" },
      {
        name: "Veg Extravaganza",
        detail: "Onion, bell pepper, jalapeno, olives, baby corn, broccoli",
      },
      {
        name: "Spicy Supreme",
        detail: "Onion, bell peppers, jalapeno, paprika, green chillies",
      },
      {
        name: "Paneer Makhani",
        detail: "Onion, capsicum, corn, paneer, olives, makhani dip",
      },
      {
        name: "Paneer Chilly",
        detail: "Onion, bell pepper, jalapeno, paprika, paneer, peri peri dip",
      },
      { name: "Tandoori Paneer", detail: "Onion, capsicum, paneer, corn" },
    ],
  },
  {
    id: "burger",
    title: "Burger",
    items: [
      { name: "Veg Tikki", detail: "Tikki, onion, lettuce, house mayo" },
      { name: "Cheesy Veg", detail: "Tikki, onion, capsicum, cheese slice, mayo" },
      { name: "Chipotle Cheese", detail: "Tikki, onion, capsicum, chipotle sauce, cheese" },
      { name: "Makhani Special", detail: "Tikki, onion, capsicum, makhani dip, cheese" },
      { name: "Tandoori Special", detail: "Tikki, onion, capsicum, tandoori mayo, cheese" },
      { name: "Veg Chatpata", detail: "Tikki, onion, capsicum, chatpata masala, mint mayo" },
      { name: "Pizza Filling", detail: "Tikki, pizza sauce, onion, capsicum, mozzarella" },
      { name: "Double Decker", detail: "2 tikki, onion, capsicum, cheese, double sauce" },
    ],
  },
  {
    id: "salad",
    title: "Salad",
    note: "Add paneer to any salad — ₹60.",
    items: [
      { name: "Exotic Veg" },
      { name: "Russian Classic" },
      { name: "Mexican Veg" },
      { name: "Peppy Veg" },
    ],
  },
  {
    id: "pasta",
    title: "Pasta",
    items: [
      { name: "Arrabiata" },
      { name: "Alfredo" },
      { name: "Aglio Olio" },
      { name: "Mac and Cheese" },
      { name: "Pink Pasta" },
      { name: "Exotic Veg" },
    ],
  },
  {
    id: "stuffed-nanza",
    title: "Stuffed Nanza",
    items: [
      { name: "Paneer Makhanwala" },
      { name: "Smoked Tandoori" },
      { name: "Spiced Supreme" },
      { name: "Exotic Cheesy" },
    ],
  },
  {
    id: "sandwiches",
    title: "Sandwiches",
    items: [
      { name: "Veg Cheese Grill" },
      { name: "Veg Mayo Grill" },
      { name: "Chipotle Cheese Grill" },
      { name: "Pizza Cheese Grill" },
      { name: "Melted Cheese Grill" },
      { name: "Makhani Paneer Grill" },
    ],
  },
  {
    id: "wraps",
    title: "Wraps",
    items: [
      { name: "Cheesy Veg" },
      { name: "Mexican Cheesy" },
      { name: "Paneer Chipotle" },
      { name: "Paneer Makhani" },
      { name: "Chatpata Paneer" },
    ],
  },
  {
    id: "bread-buns",
    title: "Bread & Buns",
    items: [
      { name: "Garlic Bread" },
      { name: "Cheese Garlic Bread" },
      { name: "Veg Burgerizza" },
      { name: "Chipotle Pull Apart Bun" },
      { name: "Cheese Pull Apart Bun" },
      { name: "Paneer Burgerizza" },
    ],
  },
  {
    id: "fries-tornado",
    title: "Fries & Tornado",
    note: "Every flavour available in both Fries and Tornado format.",
    items: [
      { name: "Regular" },
      { name: "Peri Peri" },
      { name: "Chipotle" },
      { name: "Cheesy" },
      { name: "PP Chipotle Cheese" },
    ],
  },
  {
    id: "nachos",
    title: "Nachos",
    items: [{ name: "Cheesy Nachos" }, { name: "Mexican Loaded Nachos" }],
  },
  {
    id: "momos",
    title: "Momos",
    note: "Steamed, fried or fusion — tell the counter how you want them.",
    items: [
      { name: "Veg Momos", detail: "Darjeeling style" },
      { name: "Peri Peri Momo" },
      { name: "Veg Cheese Chilli Momo" },
      { name: "Cheese Corn Momo" },
      { name: "Veg Schezwan Momo" },
      { name: "Paneer Momo" },
      { name: "Paneer Tandoori Momo" },
    ],
  },
  {
    id: "kulhad-pizza",
    title: "Kulhad Pizza",
    items: [
      { name: "Veg Classic" },
      { name: "Fresh Veggie" },
      { name: "Paneer Makhanwala" },
      { name: "Spicy Corn" },
      { name: "Yum Dum" },
      { name: "Balle Balle" },
    ],
  },
  {
    id: "maggi",
    title: "Maggi",
    items: [
      { name: "Desi" },
      { name: "Videsi" },
      { name: "Schezwan Maggi" },
      { name: "Cheesy" },
      { name: "Pink Maggi" },
      { name: "Froozo Special" },
    ],
  },
  {
    id: "waffle-pancakes",
    title: "Waffle & Pancakes",
    note: "Choose your format — waffle or pancake.",
    items: [
      { name: "Banana Caramel" },
      { name: "Chocolate Loaded" },
      { name: "Choco Oreo" },
      { name: "Choco KitKat" },
      { name: "Choco Nutella" },
      { name: "Berrylicious" },
      { name: "Cookies and Cream" },
      { name: "Brownie Dust" },
      { name: "Butter Crunch" },
      { name: "Red Velvet" },
    ],
  },
  {
    id: "shakes",
    title: "Shakes & Ice Cream Rolls",
    note: "Monster Freaks are our loaded signature shakes.",
    items: [
      { name: "Ultimate Chocolate Shake", detail: "Monster Freak", featured: true },
      { name: "Ultimate Berries Shake", detail: "Monster Freak", featured: true },
      { name: "Classic Cold Coffee" },
      { name: "Coffee Mocha" },
      { name: "KitKat Break" },
      { name: "Nutella Nudge" },
      { name: "Dark Belgian" },
      { name: "Nut-Kit-Oreo" },
      { name: "Oreo Chunk" },
      { name: "Brownie Affair" },
      { name: "Berry Blast" },
      { name: "Cookies and Cream" },
      { name: "Strawberry" },
      { name: "Butterscotch" },
    ],
  },
  {
    id: "bubble-waffle",
    title: "Bubble Waffle",
    items: [
      { name: "Choco Blast" },
      { name: "Naughty Nutella" },
      { name: "Brownie Delight" },
    ],
  },
  {
    id: "mocktails",
    title: "Mocktails",
    items: [
      { name: "Aam Pana" },
      { name: "Mix Berry Mojito" },
      { name: "Mojito Mint" },
      { name: "Mamma Mojito" },
      { name: "Pineapple Fantasy" },
      { name: "Watermelon Slush" },
      { name: "Guava Merry" },
      { name: "Blood Orange Mid Dream" },
      { name: "Violet Kimono" },
      { name: "Wake Me Up" },
      { name: "Cool Blue Slush" },
      { name: "Mountain Blue" },
      { name: "Pub Bear", detail: "Non-alcoholic" },
    ],
  },
  {
    id: "beverages",
    title: "Beverages",
    items: [
      { name: "Green Tea" },
      { name: "Masala Chai" },
      { name: "Black Coffee" },
      { name: "Cappuccino" },
      { name: "Hot Chocolate" },
      { name: "Lemon Ice Tea" },
      { name: "Masala Lemonade" },
      { name: "Mint Mojito" },
    ],
  },
];

export const outlet = {
  name: "Froozo Cafe, Madhavadhara",
  city: "Visakhapatnam",
  address: "Madhavadhara, Visakhapatnam, Andhra Pradesh 530007",
  phone: "+91 98700 73230",
  phoneHref: "tel:+919870073230",
  hours: "11:00 AM – 11:00 PM, daily",
  zomato:
    "https://www.zomato.com/visakhapatnam/froozo-cafe-madhavadhara-vizag/photos",
  swiggy: "https://www.swiggy.com/city/vizag/froozo-cafe-n-a-d-rest1234988",
  instagram: "https://www.instagram.com/froozocafe_vizag/",
  maps: "https://www.google.com/maps/place/Froozo+Cafe,+Visakhapatnam./@17.7442023,83.2553203,16z",
  mapEmbed:
    "https://www.google.com/maps?q=Froozo%20Cafe%20Madhavadhara%20Visakhapatnam&z=16&output=embed",
};
