import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { memberApi, transformMemberToUser } from "../../services/member.api";
import type { LoginInput, SignupInput, User } from "../../types/api.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  accessToken: null,
};

// Async thunks for API calls
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginInput, { rejectWithValue }) => {
    try {
      const response = await memberApi.login(credentials);
      const user = transformMemberToUser(response.member);

      // Store in localStorage for persistence
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isAuthenticated", "true");

      return { user, accessToken: response.accessToken };
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  },
);

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (data: SignupInput, { rejectWithValue }) => {
    try {
      const response = await memberApi.signup(data);
      const user = transformMemberToUser(response.member);

      // Store in localStorage for persistence
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isAuthenticated", "true");

      return { user, accessToken: response.accessToken };
    } catch (error: any) {
      return rejectWithValue(error.message || "Signup failed");
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    await memberApi.logout();
  } catch (error: any) {
    // Even if API fails, we still want to clear local state
    console.error("Logout API failed:", error);
  } finally {
    // Always clear localStorage regardless of API success/failure
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
  }

  return null;
});

export const fetchUserDetail = createAsyncThunk(
  "auth/fetchUserDetail",
  async (_, { rejectWithValue }) => {
    try {
      const member = await memberApi.getMemberDetail();
      const user = transformMemberToUser(member);

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(user));

      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch user details");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Load user from localStorage on app start
    loadUser: (state) => {
      const user = localStorage.getItem("user");
      const isAuthenticated = localStorage.getItem("isAuthenticated");

      if (user && isAuthenticated) {
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
        state.accessToken = null;
      }
    },
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Signup
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        // Always clear auth state even if logout API failed
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = null;
      });

    // Fetch user detail
    builder
      .addCase(fetchUserDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;

        // Update localStorage with new user data
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchUserDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { loadUser, clearError } = authSlice.actions;
export default authSlice.reducer;
