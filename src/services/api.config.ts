/**
 * API Configuration
 * Central configuration for all API calls
 */

const envBaseURL = import.meta.env.VITE_API_BASE_URL;

if (import.meta.env.PROD && !envBaseURL) {
  throw new Error("VITE_API_BASE_URL is required in production");
}

const resolvedBaseURL = envBaseURL || "http://localhost:3000";
const envUploadURL = import.meta.env.VITE_UPLOAD_URL;
const resolvedUploadURL = envUploadURL || `${resolvedBaseURL}/uploads`;

export const API_CONFIG = {
  baseURL: resolvedBaseURL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  uploadURL: resolvedUploadURL,
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
