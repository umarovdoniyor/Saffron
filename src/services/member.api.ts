/**
 * Member/Auth API Service
 * Handles all authentication and member-related API calls
 */

import { apiService } from "./api.service";
import { API_ENDPOINTS, API_CONFIG } from "./api.config";
import type {
  AuthResponse,
  LoginInput,
  SignupInput,
  Member,
  User,
} from "../types/api.types";

/**
 * Transform backend Member to frontend User format
 */
export const transformMemberToUser = (member: Member): User => {
  // Construct proper image URL if exists
  let imageUrl: string | undefined = undefined;
  if (member.memberImage) {
    imageUrl = member.memberImage.startsWith("uploads/")
      ? `${API_CONFIG.baseURL}/${member.memberImage}`
      : `${API_CONFIG.uploadURL}/${member.memberImage}`;
  }

  return {
    // Core Identity
    id: member._id,
    email: member.memberEmail || member.memberPhone, // Fallback to phone if no email
    name: member.memberNick,
    firstName: member.memberFirstName,
    lastName: member.memberLastName,

    // Contact Information
    phone: member.memberPhone,
    address: member.memberAddress,
    city: member.memberCity,
    state: member.memberState,
    zipCode: member.memberZipCode,
    country: member.memberCountry,

    // Profile Details
    image: imageUrl,
    description: member.memberDesc,
    dateOfBirth: member.memberDateOfBirth,
    gender: member.memberGender,

    // Account Status
    type: member.memberType,
    status: member.memberStatus,
    points: member.memberPoints,

    // Preferences
    preferences: member.memberPreferences,

    // Social Links
    socialLinks: member.memberSocialLinks,

    // Timestamps
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
  };
};

class MemberApiService {
  /**
   * Get restaurant information
   */
  async getRestaurant(): Promise<Member> {
    return apiService.get<Member>(API_ENDPOINTS.member.restaurant);
  }

  /**
   * Login user
   */
  async login(credentials: LoginInput): Promise<AuthResponse> {
    return apiService.post<AuthResponse>(
      API_ENDPOINTS.member.login,
      credentials,
    );
  }

  /**
   * Signup new user
   */
  async signup(data: SignupInput): Promise<AuthResponse> {
    return apiService.post<AuthResponse>(API_ENDPOINTS.member.signup, data);
  }

  /**
   * Logout user
   */
  async logout(): Promise<{ logout: boolean }> {
    return apiService.post<{ logout: boolean }>(API_ENDPOINTS.member.logout);
  }

  /**
   * Get logged-in member details
   */
  async getMemberDetail(): Promise<Member> {
    return apiService.get<Member>(API_ENDPOINTS.member.detail);
  }

  /**
   * Update member profile
   */
  async updateMember(data: Partial<Member>, image?: File): Promise<Member> {
    if (image) {
      const formData = new FormData();
      formData.append("memberImage", image);

      // Add other fields
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof typeof data];
        if (value !== undefined) {
          // Handle nested objects (preferences, socialLinks)
          if (typeof value === "object" && value !== null) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      return apiService.postFormData<Member>(
        API_ENDPOINTS.member.update,
        formData,
      );
    }

    return apiService.post<Member>(API_ENDPOINTS.member.update, data);
  }

  /**
   * Get top users by points
   */
  async getTopUsers(): Promise<Member[]> {
    return apiService.get<Member[]>(API_ENDPOINTS.member.topUsers);
  }
}

export const memberApi = new MemberApiService();
