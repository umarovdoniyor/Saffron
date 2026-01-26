import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  type: string;
}

export interface Order {
  id: string;
  date: string;
  status: "paused" | "active" | "completed";
  items: OrderItem[];
  totalPrice: number;
  restaurantName: string;
  deliveryAddress?: string;
  estimatedDelivery?: string;
  notes?: string;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  avatar: string;
  joinDate: string;
}

interface DashboardState {
  userInfo: UserInfo | null;
  orders: Order[];
}

const initialState: DashboardState = {
  userInfo: null,
  orders: [],
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo | null>) => {
      state.userInfo = action.payload;
    },
    updateUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ id: string; status: Order["status"] }>,
    ) => {
      state.orders = state.orders.map((order) =>
        order.id === action.payload.id
          ? { ...order, status: action.payload.status }
          : order,
      );
    },
    deleteOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(
        (order) => order.id !== action.payload,
      );
    },
    deleteAccount: (state) => {
      state.userInfo = null;
      state.orders = [];
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload); // Add to beginning of array
    },
  },
});

export const {
  setUserInfo,
  updateUserInfo,
  setOrders,
  updateOrderStatus,
  deleteOrder,
  deleteAccount,
  addOrder,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
