/**
 * Order API Service
 * Handles all order-related API calls
 */

import { apiService } from "./api.service";
import { API_ENDPOINTS } from "./api.config";
import type {
  Order,
  OrderItem,
  OrderInquiry,
} from "../types/api.types";

class OrderApiService {
  /**
   * Create a new order
   */
  async createOrder(items: OrderItem[]): Promise<Order> {
    return apiService.post<Order>(API_ENDPOINTS.order.create, items);
  }

  /**
   * Get user's orders with filtering
   */
  async getMyOrders(inquiry: Partial<OrderInquiry>): Promise<Order[]> {
    const params: Record<string, string> = {
      page: String(inquiry.page || 1),
      limit: String(inquiry.limit || 10),
    };

    if (inquiry.orderStatus) {
      params.orderStatus = inquiry.orderStatus;
    }

    return apiService.get<Order[]>(API_ENDPOINTS.order.all, params);
  }

  /**
   * Update order status
   */
  async updateOrder(orderId: string, orderStatus: string): Promise<Order> {
    return apiService.post<Order>(API_ENDPOINTS.order.update, {
      orderId,
      orderStatus,
    });
  }

  /**
   * Calculate order total including delivery
   */
  calculateOrderTotal(items: OrderItem[]): {
    subtotal: number;
    delivery: number;
    total: number;
  } {
    const subtotal = items.reduce((sum, item) => {
      return sum + item.itemPrice * item.itemQuantity;
    }, 0);

    // Delivery fee: $5 if order < $100, free otherwise
    const delivery = subtotal < 100 ? 5 : 0;
    const total = subtotal + delivery;

    return { subtotal, delivery, total };
  }
}

export const orderApi = new OrderApiService();
