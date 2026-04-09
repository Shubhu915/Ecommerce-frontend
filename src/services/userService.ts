import { api } from "@/lib/api";

export const userService = {
  getProfile: async (): Promise<any> => {
    return api.get("/user/profile");
  },

  updateProfile: async (data: any): Promise<any> => {
    return api.put("/user/profile", data);
  },

  addAddress: async (data: any): Promise<any> => {
    return api.post("/user/addresses", data);
  },

  getRecommendations: async (): Promise<any> => {
    return api.get("/user/recommendations");
  },

  trackView: async (productId: string): Promise<any> => {
    return api.post(`/user/track-view/${productId}`);
  },
};
