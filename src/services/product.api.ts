/**
 * Product API Service
 * Handles all product-related API calls
 */

import { apiService } from "./api.service";
import { API_ENDPOINTS, API_CONFIG } from "./api.config";
import type {
  BackendProduct,
  FrontendProduct,
  ProductInquiry,
} from "../types/api.types";

/**
 * Transform backend product to frontend format
 */
export const transformProduct = (product: BackendProduct): FrontendProduct => {
  // Map backend productCollection to frontend categories
  const categoryMap: Record<string, string[]> = {
    DISH: ["meat", "main"],
    DRINK: ["drinks", "beverages"],
    DESSERT: ["dessert", "brunch", "pancakes"],
    SALAD: ["vegetarian", "salad"],
    SANDWICH: ["sandwiches", "lunch"],
  };

  const categories = categoryMap[product.productCollection] || ["other"];

  // Get primary image URL
  const primaryImage = product.productImages[0] || "";
  const imageUrl = primaryImage
    ? primaryImage.startsWith("uploads/")
      ? `${API_CONFIG.baseURL}/${primaryImage}`
      : `${API_CONFIG.uploadURL}/${primaryImage}`
    : "";

  return {
    id: product._id,
    name: product.productName,
    title: product.productName,
    category: categories,
    collection: product.productCollection, // Keep original collection for filtering
    price: product.productPrice,
    oldPrice: product.productOldPrice,
    image: imageUrl,
    thumb: imageUrl,
    description: product.productDesc || `Delicious ${product.productName}`,
    text: product.productDesc || `Delicious ${product.productName}`,
    rating: product.productRating || 5,
    reviews: product.productReviews || 0,
    tags: product.productTags || categories,
    badge: product.productBadge || (product.productOldPrice ? "Sale" : ""),
    createdAt: product.createdAt,
    inStock:
      product.productLeftCount > 0 && product.productStatus === "PROCESS",
    stockCount: product.productLeftCount,
    productImages: product.productImages,
  };
};

/**
 * Get image URL helper
 */
export const getProductImageUrl = (imagePath: string): string => {
  return apiService.getUploadUrl(imagePath);
};

class ProductApiService {
  /**
   * Get all products with filtering and pagination
   */
  async getProducts(
    inquiry: Partial<ProductInquiry>,
  ): Promise<FrontendProduct[]> {
    try {
      const params: Record<string, string> = {
        page: String(inquiry.page || 1),
        limit: String(inquiry.limit || 8),
      };

      if (inquiry.order) {
        params.order = inquiry.order;
      }

      if (inquiry.search) {
        params.search = inquiry.search;
      }

      if (inquiry.productCollection) {
        params.productCollection = inquiry.productCollection;
      }

      console.log("🔍 Fetching products with params:", params);

      const response = await apiService.get<any>(
        API_ENDPOINTS.product.all,
        params,
      );

      console.log("📦 Raw API response:", response);

      // Handle different response formats from backend
      let products: BackendProduct[];

      if (Array.isArray(response)) {
        // Direct array response
        products = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        // Wrapped in data object
        products = response.data;
      } else if (
        response &&
        response.payload &&
        Array.isArray(response.payload)
      ) {
        // Wrapped in payload object
        products = response.payload;
      } else {
        console.error("❌ Unexpected response format:", response);
        return [];
      }

      console.log("✅ Products array:", products.length, "items");

      const transformedProducts = products.map(transformProduct);

      // Log first 3 products to verify different pages return different products
      if (transformedProducts.length > 0) {
        const sampleProducts = transformedProducts.slice(0, 3).map((p) => ({
          id: p.id,
          name: p.name,
        }));
        console.log(
          `📋 Page ${params.page} - First 3 products:`,
          sampleProducts,
        );
      }

      return transformedProducts;
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      return [];
    }
  }

  /**
   * Get single product by ID
   */
  async getProduct(id: string): Promise<FrontendProduct> {
    const product = await apiService.get<BackendProduct>(
      API_ENDPOINTS.product.single(id),
    );

    return transformProduct(product);
  }

  /**
   * Get products for menu (latest items)
   */
  async getMenuProducts(limit: number = 6): Promise<FrontendProduct[]> {
    const products = await this.getProducts({
      page: 1,
      limit,
      order: "createdAt", // Get latest items
    });

    return products;
  }
}

export const productApi = new ProductApiService();
