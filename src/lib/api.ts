import axios from "axios";
import { env } from "@/config/env";
import { useAuthStore } from "@/store/useAuthStore";

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    // Backend returns { success, data, meta }
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    const { clearAuth, setAccessToken } = useAuthStore.getState();
    
    // Handle 401 Unauthorized - Try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // According to update1.md: POST /auth/refresh-token
        const res = await axios.post(`${env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`, {}, {
          withCredentials: true
        });
        
        // standard format: { success: true, data: { accessToken: "..." } }
        const newToken = res.data.data.accessToken;
        setAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearAuth();
        return Promise.reject(refreshError);
      }
    }

    // Standardized Error Response Format support
    const message = error.response?.data?.message || "An unexpected error occurred";
    const errors = error.response?.data?.errors || [];
    
    return Promise.reject({ 
      ...error, 
      message, 
      errors,
      statusCode: error.response?.status 
    });
  }
);
