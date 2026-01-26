import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { productApi } from "../../services/product.api";

// Product interface
export interface Product {
  id: number | string;
  name?: string;
  title?: string;
  image?: string;
  thumb?: string;
  price?: number;
  oldPrice?: number;
  salePrice?: number;
  description?: string;
  text?: string;
  category?: string | string[];
  tags?: string[];
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  stockCount?: number;
  sku?: string;
  weight?: string;
  dimensions?: string;
  deliveryDays?: number;
  ingredients?: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
  detailedDescription?: string;
  productImages?: string[];
}

// API Response interface
interface ProductsResponse {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// State interface
interface ProductsState {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  sortBy: string;
}

// Initial state
const initialState: ProductsState = {
  products: [],
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
  sortBy: "latest",
};

// Async thunk to fetch products with pagination and sorting
export const fetchProducts = createAsyncThunk<
  ProductsResponse,
  {
    page?: number;
    limit?: number;
    sortBy?: string;
    search?: string;
    collection?: string;
  }
>(
  "products/fetchProducts",
  async (
    { page = 1, limit = 8, sortBy = "latest", search, collection },
    { rejectWithValue },
  ) => {
    try {
      // Map sortBy to backend order field
      const orderMap: Record<string, string> = {
        latest: "createdAt",
        popular: "productViews",
        priceLowToHigh: "productPrice",
        priceHighToLow: "productPrice",
      };

      console.log(`📄 Fetching page ${page} with limit ${limit}`);

      const products = await productApi.getProducts({
        page,
        limit,
        order: orderMap[sortBy] || "createdAt",
        search,
        productCollection: collection,
      });

      console.log(`✅ Received ${products.length} products for page ${page}`);

      // Apply client-side sorting for specific cases
      let sortedProducts = [...products];

      if (sortBy === "priceHighToLow") {
        console.log("💰 Sorting Price: High to Low");
        console.log(
          "Before sort - First 3 prices:",
          sortedProducts
            .slice(0, 3)
            .map((p) => ({ name: p.name, price: p.price })),
        );

        // Backend sorts price ascending, reverse it for high to low
        sortedProducts = sortedProducts.sort(
          (a, b) => (b.price || 0) - (a.price || 0),
        );

        console.log(
          "After sort - First 3 prices:",
          sortedProducts
            .slice(0, 3)
            .map((p) => ({ name: p.name, price: p.price })),
        );
      } else if (sortBy === "priceLowToHigh") {
        console.log("💰 Sorting Price: Low to High");
        console.log(
          "First 3 prices:",
          sortedProducts
            .slice(0, 3)
            .map((p) => ({ name: p.name, price: p.price })),
        );
      }
      // Other sorts are handled correctly by backend:
      // - latest: createdAt DESC
      // - popular: productViews DESC
      // - priceLowToHigh: productPrice ASC

      // If backend returns less than limit, we're on the last page
      // If it returns exactly limit, there might be more pages
      // Estimate total based on current page results
      let estimatedTotal: number;
      let estimatedPages: number;

      if (products.length < limit) {
        // Last page - calculate exact total
        estimatedTotal = (page - 1) * limit + products.length;
        estimatedPages = page;
      } else {
        // More pages might exist - estimate conservatively
        // Fetch total by requesting a large page to get all products
        estimatedTotal = page * limit + limit; // Assume at least one more page
        estimatedPages = page + 1;
      }

      return {
        products: sortedProducts,
        totalCount: estimatedTotal,
        currentPage: page,
        totalPages: estimatedPages,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch products");
    }
  },
);

// Products slice
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    clearProducts: (state) => {
      state.products = [];
      state.totalCount = 0;
      state.currentPage = 1;
      state.totalPages = 1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      });
  },
});

export const { setSortBy, clearProducts } = productsSlice.actions;
export default productsSlice.reducer;
