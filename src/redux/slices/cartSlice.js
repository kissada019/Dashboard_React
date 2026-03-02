import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import localStorage from "../../storage/localStorage";
import service from "../../utils/service";
import alert from "../../utils/alert";

const CART_STORAGE_KEY = "tree_cart";

// โหลดตะกร้าจาก localStorage
const loadCartFromStorage = () => {
  const savedCart = localStorage.get(CART_STORAGE_KEY);
  return savedCart || { items: [], total: 0, loading: false };
};

// บันทึกตะกร้าลง localStorage
const saveCartToStorage = (cart) => {
  localStorage.set(CART_STORAGE_KEY, cart);
};

/* Async Thunk: ดึงข้อมูลตะกร้าจาก API GET /cart (ส่ง token ไปด้วย) */
export const onGetCart = createAsyncThunk(
  "cart/api/getCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await service.api.get("cart");
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "ไม่สามารถดึงข้อมูลตะกร้าได้");
    }
  }
);

/* Async Thunk: ลบสินค้าออกจากตะกร้าผ่าน API DELETE /cart/<tree_id> (ส่ง token ไปด้วย) */
export const onDeleteCartItem = createAsyncThunk(
  "cart/api/deleteCartItem",
  async (tree_id, { rejectWithValue }) => {
    try {
      const response = await service.api.deleted(`cart/${tree_id}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "ไม่สามารถลบสินค้าออกจากตะกร้าได้");
    }
  }
);

/* Async Thunk: อัปเดตจำนวนสินค้าในตะกร้า PATCH /cart/<tree_id> { action: "increment" | "decrement" } */
export const onUpdateCartQuantity = createAsyncThunk(
  "cart/api/updateCartQuantity",
  async ({ tree_id, action }, { rejectWithValue }) => {
    try {
      const response = await service.api.patch(`cart/${tree_id}`, { action });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "ไม่สามารถอัปเดตจำนวนสินค้าได้");
    }
  }
);

/* Async Thunk: เพิ่มสินค้าลงตะกร้าผ่าน API POST /cart (ส่ง token ไปด้วย) */
export const onAddToCartAPI = createAsyncThunk(
  "cart/api/addToCart",
  async ({ tree_id, quantity }, { rejectWithValue }) => {
    try {
      const response = await service.api.post("cart", { tree_id, quantity });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "ไม่สามารถเพิ่มสินค้าลงตะกร้าได้");
    }
  }
);

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
  extraReducers: (builder) => {
    /* GET /cart */
    builder
      .addCase(onGetCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(onGetCart.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        // รองรับ response แบบ { items: [...] }, { data: [...] } หรือ array โดยตรง
        const cartItems = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.items)
          ? payload.items
          : Array.isArray(payload?.data)
          ? payload.data
          : [];
        state.apiItems = cartItems;
        // ใช้ totalPrice จาก API ถ้ามี ไม่งั้นคำนวณเอง
        state.apiTotal =
          payload?.totalPrice != null
            ? Number(payload.totalPrice)
            : cartItems.reduce((sum, item) => {
                const price = Number(item.sell_price ?? item.price ?? 0);
                const qty = Number(item.quantity ?? 0);
                return sum + price * qty;
              }, 0);
      })
      .addCase(onGetCart.rejected, (state) => {
        state.loading = false;
        state.apiItems = [];
        state.apiTotal = 0;
      });
    /* POST /cart */
    builder
      .addCase(onAddToCartAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(onAddToCartAPI.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(onAddToCartAPI.rejected, (state) => {
        state.loading = false;
      });
    /* PUT /cart/:tree_id (increment/decrement) */
    builder
      .addCase(onUpdateCartQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(onUpdateCartQuantity.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(onUpdateCartQuantity.rejected, (state) => {
        state.loading = false;
      });
    /* DELETE /cart/:tree_id */
    builder
      .addCase(onDeleteCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(onDeleteCartItem.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(onDeleteCartItem.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
