import { api } from "@/lib/api";

export const adminService = {
  getStats: async (): Promise<any> => {
    return api.get("/admin/stats");
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<any> => {
    return api.put(`/admin/orders/${orderId}/status`, { status });
  },

  createProduct: async (productData: any): Promise<any> => {
    return api.post("/admin/products", productData);
  },

  updateProduct: async (productId: string, productData: any): Promise<any> => {
    return api.put(`/admin/products/${productId}`, productData);
  },

  deleteProduct: async (productId: string): Promise<any> => {
    return api.delete(`/admin/products/${productId}`);
  },

  getAnalytics: async (): Promise<any> => {
    return api.get("/admin/analytics");
  },
};
