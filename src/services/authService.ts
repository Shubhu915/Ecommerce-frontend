import { api } from "@/lib/api";
import { AuthResponse, ApiResponse, User } from "@/types";

export const authService = {
  register: async (data: any): Promise<ApiResponse<void>> => {
    return api.post("/auth/register", data);
  },

  login: async (data: any): Promise<ApiResponse<AuthResponse>> => {
    return api.post("/auth/login", data);
  },

  logout: async (): Promise<ApiResponse<void>> => {
    return api.post("/auth/logout");
  },

  verifyEmail: async (token: string): Promise<ApiResponse<void>> => {
    return api.get(`/auth/verify-email?token=${token}`);
  },

  refreshToken: async (): Promise<ApiResponse<AuthResponse>> => {
    return api.post("/auth/refresh-token");
  },

  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    return api.post("/auth/forgot-password", { email });
  },

  resetPassword: async (token: string, data: any): Promise<ApiResponse<void>> => {
    return api.put(`/auth/reset-password/${token}`, data);
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    return api.get("/auth/me");
  },
};
