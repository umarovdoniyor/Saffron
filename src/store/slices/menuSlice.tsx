import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { productApi } from "../../services/product.api";

export interface FoodItem {
  id: number | string;
  name?: string;
  title?: string;
  category: string[];
  price: number;
  oldPrice?: number;
  image?: string;
  thumb?: string;
  description?: string;
  text?: string;
  rating?: number;
  createdAt?: string;
  inStock?: boolean;
  stockCount?: number;
  [key: string]: any;
}

export interface Category {
  id: string;
  label: string;
  filterClass: string;
}

interface MenuState {
  items: FoodItem[];
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  items: [],
  categories: [],
  loading: false,
  error: null,
};

// Predefined categories based on productCollection from backend
const PREDEFINED_CATEGORIES: Category[] = [
  { id: ".dish", label: "Dish", filterClass: ".dish" },
  { id: ".salad", label: "Salad", filterClass: ".salad" },
  { id: ".dessert", label: "Dessert", filterClass: ".dessert" },
  { id: ".drink", label: "Drink", filterClass: ".drink" },
  { id: ".other", label: "Other", filterClass: ".other" },
];

// Helper function to get latest 6 items per collection type
const getLatest6PerCategory = (items: FoodItem[]): FoodItem[] => {
  const categoryMap = new Map<string, FoodItem[]>();

  // Group items by collection (DISH, SALAD, DESSERT, DRINK, SANDWICH)
  items.forEach((item) => {
    const collection = (item as any).collection?.toLowerCase() || "other";
    if (!categoryMap.has(collection)) {
      categoryMap.set(collection, []);
    }
    categoryMap.get(collection)!.push(item);
  });

  // Get latest 6 items for each category
  const result = new Map<number | string, FoodItem>();
  categoryMap.forEach((categoryItems) => {
    const sorted = categoryItems.sort((a, b) => {
      // Sort by createdAt if available, otherwise by id (assuming higher id = newer)
      if (a.createdAt && b.createdAt) {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return Number(b.id) - Number(a.id);
    });

    // Take only the latest 6 items
    const latest6 = sorted.slice(0, 6);
    latest6.forEach((item) => {
      result.set(item.id, item);
    });
  });

  return Array.from(result.values());
};

// Async thunk to fetch menu data from backend API
export const fetchMenuData = createAsyncThunk(
  "menu/fetchMenuData",
  async (_, { rejectWithValue }) => {
    try {
      // Fetch products from backend API
      const products = await productApi.getMenuProducts(100); // Fetch more items to display all products

      console.log("📦 Fetched products from API:", products.length);
      console.log(
        "📊 Products by collection:",
        products.reduce((acc: any, p: any) => {
          const col = p.collection || "none";
          acc[col] = (acc[col] || 0) + 1;
          return acc;
        }, {}),
      );

      // Return all products (removed the 6-per-category limit)
      return products;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch menu data");
    }
  },
);

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenuItems: (state, action: PayloadAction<FoodItem[]>) => {
      state.items = action.payload;
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    clearMenu: (state) => {
      state.items = [];
      state.categories = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuData.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;

        // Use predefined categories instead of extracting from items
        state.categories = PREDEFINED_CATEGORIES;
      })
      .addCase(fetchMenuData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch menu data";
      });
  },
});

export const { setMenuItems, setCategories, clearMenu } = menuSlice.actions;
export default menuSlice.reducer;
