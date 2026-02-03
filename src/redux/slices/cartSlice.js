import { createSlice } from "@reduxjs/toolkit";
import localStorage from "../../storage/localStorage";

const CART_STORAGE_KEY = "tree_cart";

// โหลดตะกร้าจาก localStorage
const loadCartFromStorage = () => {
  const savedCart = localStorage.get(CART_STORAGE_KEY);
  return savedCart || { items: [], total: 0 };
};

// บันทึกตะกร้าลง localStorage
const saveCartToStorage = (cart) => {
  localStorage.set(CART_STORAGE_KEY, cart);
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { tree, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === tree.id);

      if (existingItem) {
        existingItem.quantity += quantity;
        if (existingItem.quantity > tree.quantity) {
          existingItem.quantity = tree.quantity;
        }
      } else {
        state.items.push({
          id: tree.id,
          name: tree.name,
          species: tree.species,
          price: tree.sell_price,
          image: tree.images?.[0] || "",
          quantity: Math.min(quantity, tree.quantity),
          maxQuantity: tree.quantity,
          location: tree.location,
        });
      }

      // คำนวณยอดรวม
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      saveCartToStorage(state);
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      saveCartToStorage(state);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.maxQuantity));
        state.total = state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        saveCartToStorage(state);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      saveCartToStorage(state);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
