/**
 * API Configuration
 * Central configuration for all API calls
 */

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  uploadURL: import.meta.env.VITE_UPLOAD_URL || "http://localhost:3000/uploads",
  withCredentials: true, // Important for JWT cookies
};

export const API_ENDPOINTS = {
  // Member endpoints
  member: {
    restaurant: "/member/restaurant",
    login: "/member/login",
    signup: "/member/signup",
    logout: "/member/logout",
    detail: "/member/detail",
    update: "/member/update",
    topUsers: "/member/top-users",
  },
  // Product endpoints
  product: {
    all: "/product/all",
    single: (id: string) => `/product/${id}`,
  },
  // Order endpoints
  order: {
    create: "/order/create",
    all: "/order/all",
    update: "/order/update",
  },
};
