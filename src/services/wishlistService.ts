import { api } from "@/lib/api";

export const wishlistService = {
  getWishlist: async (): Promise<any> => {
    return api.get("/wishlist");
  },

  toggleWishlist: async (productId: string): Promise<any> => {
    return api.post(`/wishlist/${productId}`);
  },
};
