/**
 * Core API Service
 * Handles all HTTP requests with proper error handling and interceptors
 */

import { API_CONFIG } from "./api.config";
import type { ApiError } from "../types/api.types";

class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
  }

  /**
   * Generic fetch wrapper with error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      credentials: "include", // Important for cookies
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-2xx responses
      if (!response.ok) {
        const error: ApiError = await response.json();
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const queryString = params
      ? "?" + new URLSearchParams(params).toString()
      : "";
    return this.request<T>(`${endpoint}${queryString}`, {
      method: "GET",
    });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * POST request with FormData (for file uploads)
   */
  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        body: formData,
        // Don't set Content-Type header - browser will set it with boundary
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error("API Upload Error:", error);
      throw error;
    }
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }

  /**
   * Get full upload URL for images
   */
  getUploadUrl(path: string): string {
    if (!path) return "";

    // If it's already a full URL, return it
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    // If it starts with /uploads, use it directly
    if (path.startsWith("/uploads")) {
      return `${this.baseURL}${path}`;
    }

    // Otherwise, assume it's a relative path from uploads
    return `${API_CONFIG.uploadURL}/${path}`;
  }
}

export const apiService = new ApiService();
