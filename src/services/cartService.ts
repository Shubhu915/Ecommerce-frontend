import { api } from "@/lib/api";

export const cartService = {
  getCart: async (): Promise<any> => {
    return api.get("/cart");
  },

  addToCart: async (productId: string, qty: number): Promise<any> => {
    return api.post("/cart/add", { productId, qty });
  },

  updateCartItem: async (itemId: string, qty: number): Promise<any> => {
    return api.put(`/cart/update/${itemId}`, { qty });
  },

  removeFromCart: async (itemId: string): Promise<any> => {
    return api.delete(`/cart/${itemId}`);
  },
};
