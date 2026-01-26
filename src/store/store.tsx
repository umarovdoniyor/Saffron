import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice"; // Import the cart reducer
import authReducer from "./slices/authSlice"; // Import the auth reducer
import dashboardReducer from "./slices/dashboardSlice"; // Import the dashboard reducer
import menuReducer from "./slices/menuSlice"; // Import the menu reducer
import productsReducer from "./slices/productsSlice"; // Import the products reducer

// Load state from localStorage
const loadFromLocalStorage = () => {
  try {
    const stateStr = localStorage.getItem("cartState");
    return stateStr ? JSON.parse(stateStr) : undefined;
  } catch (err) {
    console.error("Could not load state", err);
    return undefined;
  }
};

// Load dashboard state from localStorage
const loadDashboardFromLocalStorage = () => {
  try {
    const stateStr = localStorage.getItem("dashboardState");
    return stateStr ? JSON.parse(stateStr) : undefined;
  } catch (err) {
    console.error("Could not load dashboard state", err);
    return undefined;
  }
};

// Save state to localStorage
const saveToLocalStorage = (state: any) => {
  try {
    const stateStr = JSON.stringify(state);
    localStorage.setItem("cartState", stateStr);
  } catch (err) {
    console.error("Could not save state", err);
  }
};

// Save dashboard state to localStorage
const saveDashboardToLocalStorage = (state: any) => {
  try {
    const stateStr = JSON.stringify(state);
    localStorage.setItem("dashboardState", stateStr);
  } catch (err) {
    console.error("Could not save dashboard state", err);
  }
};

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    dashboard: dashboardReducer,
    menu: menuReducer,
    products: productsReducer,
  },
  preloadedState: {
    cart: loadFromLocalStorage(), // Load cart from localStorage
    dashboard: loadDashboardFromLocalStorage(), // Load dashboard from localStorage
  },
});

store.subscribe(() => {
  saveToLocalStorage(store.getState().cart); // Save cart state
  saveDashboardToLocalStorage(store.getState().dashboard); // Save dashboard state
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
