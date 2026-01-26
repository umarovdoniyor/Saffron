/**
 * API Types - Matching Backend Interfaces
 */

// Member/User Types
export interface Member {
  _id: string;
  memberType: "USER" | "RESTAURANT";
  memberStatus: "ACTIVE" | "BLOCK" | "DELETE";
  memberNick: string;
  memberPhone: string;
  memberPassword?: string; // Only in requests, not responses
  memberEmail?: string;
  memberFirstName?: string;
  memberLastName?: string;
  memberAddress?: string;
  memberCity?: string;
  memberState?: string;
  memberZipCode?: string;
  memberCountry?: string;
  memberDesc?: string;
  memberImage?: string;
  memberPoints: number;
  memberDateOfBirth?: string;
  memberGender?: "MALE" | "FEMALE" | "OTHER";
  memberPreferences?: {
    notifications: boolean;
    newsletter: boolean;
    language: string;
  };
  memberSocialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface User {
  // Core Identity
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;

  // Contact Information
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;

  // Profile Details
  image?: string;
  description?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";

  // Account Status
  type?: "USER" | "RESTAURANT";
  status?: "ACTIVE" | "BLOCK" | "DELETE";
  points?: number;

  // Preferences
  preferences?: {
    notifications: boolean;
    newsletter: boolean;
    language: string;
  };

  // Social Links
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };

  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginInput {
  memberNick: string;
  memberPassword: string;
}

export interface SignupInput {
  // Required Fields
  memberNick: string;
  memberEmail: string;
  memberPhone: string;
  memberPassword: string;

  // Optional Personal Info
  memberFirstName?: string;
  memberLastName?: string;
  memberDateOfBirth?: string;
  memberGender?: "MALE" | "FEMALE" | "OTHER";

  // Optional Address
  memberAddress?: string;
  memberCity?: string;
  memberState?: string;
  memberZipCode?: string;
  memberCountry?: string;

  // Optional Profile
  memberDesc?: string;
  memberImage?: string;
}

export interface AuthResponse {
  member: Member;
  accessToken: string;
}

// Product Types
export interface BackendProduct {
  _id: string;
  productStatus: "PAUSE" | "PROCESS";
  productCollection: string;
  productName: string;
  productPrice: number;
  productLeftCount: number;
  productSize: string;
  productVolume: number;
  productDesc?: string;
  productImages: string[];
  productViews: number;
  productOldPrice?: number; // For sale/discount display
  productRating?: number; // Product rating (1-5)
  productReviews?: number; // Number of reviews
  productTags?: string[]; // Tags for filtering
  productBadge?: string; // "Sale", "New", "Hot" badges
  createdAt: string;
  updatedAt: string;
}

export interface FrontendProduct {
  id: number | string;
  name: string;
  title: string;
  category: string[];
  collection?: string; // Original productCollection (DISH, DRINK, DESSERT, SALAD, SANDWICH)
  price: number;
  oldPrice?: number;
  image: string;
  thumb: string;
  description?: string;
  text?: string;
  rating?: number;
  reviews?: number;
  tags?: string[];
  badge?: string;
  createdAt?: string;
  inStock?: boolean;
  stockCount?: number;
  productImages?: string[];
}

export interface ProductInquiry {
  page: number;
  limit: number;
  order?: string;
  search?: string;
  productCollection?: string;
}

// Order Types
export interface OrderItem {
  productId: string;
  itemQuantity: number;
  itemPrice: number;
}

export interface Order {
  _id: string;
  orderTotal: number;
  orderDelivery: number;
  orderStatus: "PAUSE" | "PROCESS" | "FINISH" | "DELETE";
  memberId: string;
  orderItems?: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  items: OrderItem[];
}

export interface OrderInquiry {
  page: number;
  limit: number;
  orderStatus: string;
}

// API Response Types
export interface ApiError {
  code: number;
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}
