import { api } from "@/lib/api";

export const orderService = {
  createOrder: async (orderData: any): Promise<any> => {
    return api.post("/orders", orderData);
  },

  getMyOrders: async (): Promise<any> => {
    return api.get("/orders/my-orders");
  },

  getOrderDetails: async (orderId: string): Promise<any> => {
    return api.get(`/orders/${orderId}`);
  },

  cancelOrder: async (orderId: string): Promise<any> => {
    return api.put(`/orders/${orderId}/cancel`);
  },
};
