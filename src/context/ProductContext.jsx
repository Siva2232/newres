import { createContext, useContext, useEffect, useState } from "react";

/* ---------- Mock Products ---------- */
const MOCK_PRODUCTS = [
  {
    id: "PROD-001",
    name: "Chicken Biryani",
    price: 220,
    description: "Aromatic & spicy",
    category: "Biryani",
    image: "https://static.vecteezy.com/system/resources/previews/067/390/426/large_2x/chicken-biryani-dish-served-on-black-plate-in-natural-light-free-photo.jpg",
    available: true,
  },
  {
    id: "PROD-002",
    name: "Paneer Butter Masala",
    price: 180,
    description: "Creamy & delicious",
    category: "Curry",
    image: "https://vegecravings.com/wp-content/uploads/2017/04/paneer-butter-masala-recipe-step-by-step-instructions.jpg",
    available: true,
  },
  {
    id: "PROD-003",
    name: "Veg Noodles",
    price: 150,
    description: "Stir-fried with veggies",
    category: "Noodles",
    image: "https://myfoodstory.com/wp-content/uploads/2021/02/Vegetable-Hakka-Noodles-Restaurant-Style-3.jpg",
    available: true,
  },
  {
    id: "PROD-004",
    name: "Mutton Curry",
    price: 250,
    description: "Rich & spicy mutton curry",
    category: "Curry",
    image: "https://maunikagowardhan.co.uk/wp-content/uploads/2015/04/Kadai-Gosht1-1024x683.jpg",
    available: true,
  },
  {
    id: "PROD-005",
    name: "Veg Salad",
    price: 120,
    description: "Fresh garden vegetables",
    category: "Salad",
    image: "https://cdn.jwplayer.com/v2/media/wGEqBtuf/thumbnails/qSXwlEH3.jpg?width=1280",
    available: true,
  },
  {
    id: "PROD-006",
    name: "Butter Naan",
    price: 60,
    description: "Soft tandoori bread brushed with butter",
    category: "Bread",
    image: "https://media.gettyimages.com/id/1298748782/photo/traditional-indian-naan-flatbread.jpg?s=612x612&w=gi&k=20&c=JpEQkvatZi7L0nUv89GMCZMnnsLYaqSmnQXH5R_U72M=",
    available: true,
  },
  {
    id: "PROD-007",
    name: "Dal Tadka",
    price: 160,
    description: "Tempered yellow lentils with spices",
    category: "Curry",
    image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/02/dal-fry.webp",
    available: true,
  },
  {
    id: "PROD-008",
    name: "Chicken Tikka Masala",
    price: 240,
    description: "Grilled chicken in creamy tomato sauce",
    category: "Curry",
    image: "https://www.allrecipes.com/thmb/1ul-jdOz8H4b6BDrRcYOuNmJgt4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/239867chef-johns-chicken-tikka-masala-ddmfs-3X4-0572-e02a25f8c7b745459a9106e9eb13de10.jpg",
    available: true,
  },
  {
    id: "PROD-009",
    name: "Palak Paneer",
    price: 190,
    description: "Cottage cheese in creamy spinach gravy",
    category: "Curry",
    image: "https://www.foodandwine.com/thmb/QqinPDSGc2krV8XDgZWwoxVgi5s=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/palak-paneer-with-pressed-ricotta-FT-RECIPE0322-4c6f0e411c6444bd81152cb2d078f2bd.jpg",
    available: true,
  },
  {
    id: "PROD-010",
    name: "Gulab Jamun",
    price: 90,
    description: "Soft fried dumplings soaked in rose syrup",
    category: "Dessert",
    image: "https://media.istockphoto.com/id/668147754/photo/gulab-jamun.jpg?s=612x612&w=0&k=20&c=yM8YjrafVCS6SLTEWQH4s2FVduHnAzfkUIR-KkWI7Z0=",
    available: true,
  },
];

/* ---------- Helpers ---------- */
const getProducts = () => {
  let stored = JSON.parse(localStorage.getItem("products")) || [];
  let merged = [...stored];
  let changed = false;

  const storedIds = new Set(stored.map((p) => p.id));

  MOCK_PRODUCTS.forEach((mock) => {
    if (storedIds.has(mock.id)) {
      // Update core fields of existing mock products (name, price, description, category, image)
      // but preserve `available` and any future custom fields
      const index = merged.findIndex((p) => p.id === mock.id);
      const current = merged[index];

      if (
        current.name !== mock.name ||
        current.price !== mock.price ||
        current.description !== mock.description ||
        current.category !== mock.category ||
        current.image !== mock.image
      ) {
        merged[index] = {
          ...current,
          name: mock.name,
          price: mock.price,
          description: mock.description,
          category: mock.category,
          image: mock.image,
        };
        changed = true;
      }
    } else {
      // Add new mock products that are missing
      merged.push(mock);
      changed = true;
    }
  });

  // Only write to localStorage if something actually changed or was added
  if (changed) {
    localStorage.setItem("products", JSON.stringify(merged));
    window.dispatchEvent(new Event("storage"));
  }

  return merged;
};

const setProductsToStorage = (data) => {
  localStorage.setItem("products", JSON.stringify(data));
  window.dispatchEvent(new Event("storage"));
};

/* ---------- Context ---------- */
const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(getProducts());

  /* Sync between tabs (admin & customer) */
  useEffect(() => {
    const sync = () => setProducts(getProducts());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  /* Admin Actions */
  const addProduct = (product) => {
    const updated = [...products, product];
    setProducts(updated);
    setProductsToStorage(updated);
  };

  const updateProduct = (id, data) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, ...data } : p
    );
    setProducts(updated);
    setProductsToStorage(updated);
  };

  const toggleAvailability = (id) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, available: !p.available } : p
    );
    setProducts(updated);
    setProductsToStorage(updated);
  };

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, toggleAvailability }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);