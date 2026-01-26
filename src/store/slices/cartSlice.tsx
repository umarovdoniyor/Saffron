import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { orderApi } from "../../services/order.api";
import type { OrderItem } from "../../types/api.types";

interface CartItem {
  id: number | string;
  title: string;
  price: number;
  quantity: number;
  thumb: string;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunk to create order from cart
export const createOrderFromCart = createAsyncThunk(
  "cart/createOrder",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { cart: CartState };
      const cartItems = state.cart.items;

      // Transform cart items to order items
      const orderItems: OrderItem[] = cartItems.map((item) => ({
        productId: String(item.id),
        itemQuantity: item.quantity,
        itemPrice: item.price,
      }));

      const order = await orderApi.createOrder(orderItems);
      return order;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create order");
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        (item) => item.id === action.payload.id,
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<number | string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number | string; quantity: number }>,
    ) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderFromCart.fulfilled, (state) => {
        state.loading = false;
        state.items = []; // Clear cart after successful order
        state.error = null;
      })
      .addCase(createOrderFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  clearError,
} = cartSlice.actions;

export default cartSlice.reducer;
